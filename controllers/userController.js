// import { User } from "../models/userModel.js";

// import catchAsync from "../handleErrors/catchAsync.js";
// //get all users
// const getUsers = catchAsync(async (req, res) => {
//   let users = await User.find();
//   res.status(200).json({ msg: "success", users });
// });
// //get user by id
// const getOneUser = catchAsync(async (req, res) => {
//   let userId = req.params.id;
//   let user = await User.findById(userId).populate("myCart");
//   if (!user) {
//     return next(new AppError("not found user", 401));
//   }
//   res.status(200).json({ msg: "success", user });
// });

// export { getUsers, getOneUser };
import { User } from "../models/userModel.js";

import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
//get all users
const getUsers = catchAsync(async (req, res) => {
  let users = await User.find();
  res.status(200).json({ msg: "success", users });
});
//get user by id
const getOneUser = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let user = await User.findById(userId)
    .populate("myCart")
    .populate("products");
  if (!user) {
    return next(new AppError("not found user", 401));
  }

  const targetProducts = await Product.find({ workshop_id: userId });

  res.status(200).json({ msg: "success", user, targetProducts });
});
const getMyProfile = catchAsync(async (req, res) => {
  let userId = req.user.id;
  let user = await User.findById(userId); //.populate('myCart')
  res.status(200).json({ msg: "success", user });
});
const searchbyName = catchAsync(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    return res.status(400).json({ msg: "Search term is required" });
  }
  // const query = new RegExp(`^${search}`, 'i');

  // Find users by email or name, excluding the password field
  const users = await User.find({
    fullName: {
      $regex: `^${fullName}`,
      $options: "i",
    },
  })
    .select("-password")
    .find({ _id: { $ne: req.user.id } });

  if (!users || users.length === 0) {
    return res.status(404).json({ msg: "No users found" });
  }
  // users.find({_id:{$ne:req.user.id}})
  res.status(200).json({ msg: "Success", users });
});
const updateProfile = catchAsync(async (req, res) => {
  let userId = req.user.id;
  let user = await User.findByIdAndUpdate(userId, req.body, { new: true });
  res.status(200).json({ msg: "success", user });
});
export { getUsers, getOneUser, getMyProfile, searchbyName };
