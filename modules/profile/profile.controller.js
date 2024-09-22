import { User } from "../../models/userModel.js";

import catchAsync from "../../handleErrors/catchAsync.js";

//get user by id
const getOneUser = catchAsync(async (req, res) => {
  let userId = req.user.id;
  let user = await User.findById(userId).populate("myCart");
  if (!user) {
    return next(new AppError("not found user", 401));
  }
  res.status(200).json({ msg: "success", user });
});

const modifyLoginStatus = catchAsync(async (req, res) => {
  let userId = req.user.id;
  let user = await User.findById(userId);
  if (!user) {
    return next(new AppError("not found user", 401));
  }
  user.isLoggedin = false;
  console.log(user.isLoggedin);
  res.status(200).json({ msg: "success", user });
});

export { getOneUser, modifyLoginStatus };
