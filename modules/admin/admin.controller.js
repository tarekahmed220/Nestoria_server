import AppError from "../../handleErrors/appError.js";
import catchAsync from "../../handleErrors/catchAsync.js";
import { User } from "../../models/userModel.js";

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

const acceptanceState = catchAsync(async (req, res, next) => {
  const { state } = req.body;
  const { email } = req.params;

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

export {
  getAllClients,
  getAllWorkshops,
  deleteClient,
  updateWorkshop,
  getWorkshopRequests,
  acceptanceState,
};
