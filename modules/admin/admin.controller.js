import AppError from "../../handleErrors/appError.js";
import catchAsync from "../../handleErrors/catchAsync.js";
import { User } from "../../models/userModel.js";
import sendStripeEmail from "../../middlewares/stripeEmail.js";
import Stripe from "stripe";
import { createTransfer } from "../payment/createPayout.js";
import checkoutModel from "../../models/checkout.model.js";
import mongoose from "mongoose";

const getAllClients = catchAsync(async (req, res, next) => {
  const { category, keyword, limit = 6, page = 1 } = req.query;
  console.log("keyword", keyword);
  const condition = {};

  if (category) {
    condition.isConfirm = category;
  }

  if (keyword) {
    condition.fullName = { $regex: new RegExp(keyword, "i") };
  }

  const offset = (page - 1) * limit;

  const clientAccounts = await User.find({ ...condition, role: "client" })
    .sort({ createdAt: -1 })
    .select(
      "-myCart  -topSellingProducts -isLoggedin -createdAt -_id -updatedAt -products -ordersSold -acceptance -id -ratings"
    )
    .limit(Number(limit))
    .skip(offset);

  const countDocuments = await User.countDocuments({
    ...condition,
    role: "client",
  });

  if (!clientAccounts) {
    return next(new AppError("no client accounts founded", 404));
  }

  const totalPages = Math.ceil(countDocuments / limit);

  return res.json({
    message: "all clients",
    clientsNumbers: clientAccounts.length,
    countDocuments: countDocuments,
    totalPages: totalPages,
    clientAccounts: clientAccounts,
  });
});

const getAllWorkshops = catchAsync(async (req, res, next) => {
  const { category, keyword, limit = 6, page = 1 } = req.query;
  console.log("category", category);
  const condition = {};

  if (category) {
    condition.acceptance = category;
  }

  if (keyword) {
    condition.name = { $regex: new RegExp(keyword, "i") };
  }

  const offset = (page - 1) * limit;

  const clientAccounts = await User.find({ ...condition, role: "workshop" })
    .select(
      "-myCart  -topSellingProducts -isLoggedin  -updatedAt  -ordersSold  -id -ratings"
    )
    .limit(Number(limit))
    .skip(offset);

  const countDocuments = await User.countDocuments({
    ...condition,
    role: "workshop",
  });

  if (!clientAccounts) {
    return next(new AppError("no workshop accounts founded", 404));
  }

  const totalPages = Math.ceil(countDocuments / limit);

  return res.json({
    message: "all clients",
    clientsNumbers: clientAccounts.length,
    countDocuments: countDocuments,
    totalPages: totalPages,
    clientAccounts: clientAccounts,
  });
});

const deleteClient = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  if (email) {
    await User.findOneAndDelete({ email: email });
    res.json({ message: "Client account deleted successfully" });
  } else {
    return next(
      new AppError("there is no account with that email address", 404)
    );
  }
});

const updateWorkshop = catchAsync(async (req, res, next) => {
  const {
    workshopName,
    avatar,
    taxFile,
    bankStatement,
    frontID,
    backID,
    address,
  } = req.body;

  const workshopId = req.user._id;
  if (workshopId) {
    const workshop = await User.findById(workshopId);
    if (workshop) {
      // console.log("workshop", workshop);
      const updatedWorkshop = await User.findByIdAndUpdate(workshopId, {
        name: workshopName,
        address,
        registerStatus: "pending",
        registrationDocuments: {
          nationalIDFront: frontID,
          nationalIDBack: backID,
          commercialRecord: taxFile,
          bankStatement: bankStatement,
          personalPhoto: avatar,
        },
      });

      return res.json({
        message: "your data updated successfully",
        updatedWorkshop,
      });
    } else {
      return next(new AppError("There is no workshop founded", 404));
    }
  } else {
    return next(new AppError("There is no user with that id", 404));
  }
});

const getWorkshopRequests = catchAsync(async (req, res, next) => {
  const workshopReq = await User.find({
    role: "workshop",
    registerStatus: "pending",
  }).select("-myCart");

  const numOfReq = await User.countDocuments({
    role: "workshop",
    registerStatus: "pending",
  });

  if (workshopReq) {
    res.json({ message: "all Requests", numberOfReq: numOfReq, workshopReq });
  } else {
    return next(new AppError("There are no requests yet"));
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const acceptanceState = catchAsync(async (req, res, next) => {
  const { state } = req.body;
  const { email } = req.params;
  console.log("email", email);

  if (!email) {
    return next(
      new AppError("there is no account with that email address", 404)
    );
  }

  let updateData;

  if (state === "reject") {
    updateData = {
      registerStatus: "modify",
      acceptance: false,
    };
  } else {
    updateData = {
      registerStatus: "completed",
      acceptance: true,
    };

    try {
      const account = await stripe.accounts.create({
        type: "express",
      });

      console.log("Vendor Account ID:", account.id);

      const updateUser = await User.findOneAndUpdate(
        { email: email },
        { StripeAccountID: account.id }
      );

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:3000/login",
        return_url: "http://localhost:3000/login",
        type: "account_onboarding",
      });

      console.log("Account Link URL:", accountLink.url);
      sendStripeEmail(email, accountLink.url);
    } catch (error) {
      console.error("Error creating vendor account or link:", error);
    }
  }

  const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  });

  if (!updatedUser) {
    return next(new AppError("No user found with that email", 404));
  }

  res.json({
    message:
      state === "reject"
        ? "Client account rejected successfully"
        : "Client account accepted successfully",
    updatedUser,
  });
});

const createWorkshopTransfer = catchAsync(async (req, res, next) => {
  try {
    const { amount, connectedAccountId, orderId, userId, productId, color } =
      req.body;

    // Create the transfer
    const transfer = await createTransfer(amount, connectedAccountId);

    const orderObjectId = new mongoose.Types.ObjectId(orderId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);
    // Update the specific product's paymentApprove field
    const targetOrder = await checkoutModel.findOneAndUpdate(
      {
        _id: orderObjectId,
        userId: userObjectId, // Match userId directly
        products: {
          $elemMatch: {
            _id: productObjectId,
            color: color,
          },
        },
      },

      {
        $set: { "products.$.paymentApprove": true }, // Use $ operator to update the matched product
      }, // Use $ operator to update the matched product
      { new: true } // Return the modified document
    );
    console.log("targetOrder", targetOrder);

    // Debugging output
    if (targetOrder) {
      console.log("Order found and updated:", targetOrder);
    } else {
      console.log("No order found with the specified criteria.");
    }

    res.send("Transfer created successfully");
  } catch (error) {
    console.error("Error in creating transfer:", error);
    res.status(500).send("Error creating transfer");
  }

  // Get balance
  try {
    const balance = await stripe.balance.retrieve();
    console.log("Current Balance:", balance);
  } catch (error) {
    console.error("Error retrieving balance:", error);
  }
  console.log("Current Stripe Key:", process.env.STRIPE_SECRET_KEY);
});

const getWorkshopBalance = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById({ _id: _id });
  if (user) {
    const StripeAccountID = user.StripeAccountID;

    try {
      // Retrieve the balance for the specific connected account
      const balance = await stripe.balance.retrieve({
        stripeAccount: StripeAccountID,
      });
      // console.log("Seller Balance:", balance.available[0].amount / 100);
      res.json({ sellerBalance: balance.available[0].amount / 100 });
    } catch (error) {
      console.error("Error retrieving seller balance:", error);
      next(new AppError("there is an error while get seller balance"));
      throw error;
    }
  } else {
    res.json({
      message:
        "sorry, you need to create a stripe bank account to see your balance",
    });
  }
});
const getAdminBalance = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById({ _id: _id, role: "admin" });
  if (user) {
    try {
      // Retrieve the balance for the specific connected account
      const balance = await stripe.balance.retrieve();
      // console.log("Seller Balance:", balance.available[0].amount / 100);
      res.json({
        availableBalance: balance.available[0].amount / 100,
        pendingBalance: balance.pending[0].amount / 100,
      });
    } catch (error) {
      console.error("Error retrieving seller balance:", error);
      next(new AppError("there is an error while get seller balance"));
      throw error;
    }
  } else {
    res.json({
      message:
        "sorry, you need to create a stripe bank account to see your balance",
    });
  }
});

const listCharges = catchAsync(async (req, res, next) => {
  try {
    const charges = await stripe.charges.list({
      limit: 100,
    });

    const transfers = await stripe.transfers.list({
      limit: 100,
    });

    res.json({ message: "success", transfers, charges });
  } catch (error) {
    next(new AppError("Error fetching charges", 422));
  }
});

const moneyTransferRequests = catchAsync(async (req, res, next) => {
  // const { page = 1, limit = 10 } = req.query;
  // const offset = (page - 1) * limit;

  const orders = await checkoutModel
    .find({
      products: {
        $elemMatch: {
          deliveryStatus: "Delivered",
          paymentApprove: false,
        },
      },
    })
    .populate({
      path: "products.productId",
      populate: {
        path: "workshop_id",
        select: "name email StripeAccountID",
      },
    })
    .populate("userId", "fullName email address phone")
    .select("userId products total updatedAt _id");

  // Filter the products in each order to include only those that match the criteria
  const filteredOrders = orders.map((order) => {
    const filteredProducts = order.products.filter(
      (product) =>
        product.deliveryStatus === "Delivered" && !product.paymentApprove
    );

    return {
      ...order.toObject(),
      products: filteredProducts,
    };
  });

  if (filteredOrders.length > 0) {
    try {
      res.json({ message: "success", orders: filteredOrders });
    } catch (error) {
      next(new AppError("There is an error while getting seller balance"));
    }
  } else {
    res.json({
      message: "Sorry, you don't have any money requests yet",
    });
  }
});

export {
  getAllClients,
  getAllWorkshops,
  deleteClient,
  updateWorkshop,
  getWorkshopRequests,
  acceptanceState,
  createWorkshopTransfer,
  getAdminBalance,
  getWorkshopBalance,
  moneyTransferRequests,
  listCharges,
};
