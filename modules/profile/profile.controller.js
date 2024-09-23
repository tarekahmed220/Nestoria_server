import { User } from "../../models/userModel.js";

import catchAsync from "../../handleErrors/catchAsync.js";
import { Product } from "../../models/productModel.js";

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

const addReview = catchAsync(async (req, res, next) => {
  const {
    workshopRating,
    productRating,
    productComment,
    workshopComment,
    workshop_id,
    productId,
  } = req.body;
  let userId = req.user.id;

  // Find the workshop user
  let user = await User.findById(workshop_id);
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  // Add review to workshop
  user.ratings = [
    ...user.ratings,
    {
      rating: workshopRating,
      comment: workshopComment,
      user: userId,
    },
  ];
  user.averageRating =
    user.ratings.reduce((acc, item) => item.rating + acc, 0) /
    user.ratings.length;

  // Find the product
  const targetProduct = await Product.findById(productId);
  if (!targetProduct) {
    return next(new AppError("Product not found", 401));
  }
  console.log("targetProduct", targetProduct);

  // Add review to product
  targetProduct.ratings = [
    ...targetProduct.ratings,
    {
      rating: productRating,
      comment: productComment,
      user: userId,
    },
  ];
  targetProduct.averageRating =
    targetProduct.ratings.reduce((acc, item) => item.rating + acc, 0) /
    targetProduct.ratings.length;

  // Save both workshop user and product
  await Promise.all([user.save(), targetProduct.save()]);

  res.status(200).json({ msg: "success", targetProduct });
});

export { getOneUser, modifyLoginStatus, addReview };
