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

export { getAllClients, getAllWorkshops, deleteClient };
