import { User } from "../../models/userModel.js";

import catchAsync from "../../handleErrors/catchAsync.js";
import { Product } from "../../models/productModel.js";
import checkoutModel from "../../models/checkout.model.js";

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
    orderId,
    color,
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

  // find target Order to adjust isRated attr
  const targetOrder = await checkoutModel.findOne({
    _id: orderId,
    "products.productId": productId,
    "products.color": color,
  });

  if (!targetOrder) {
    return next(new AppError("Order not found", 401));
  }
  const targetProductWithReview = targetOrder.products.find(
    (product) =>
      product.productId.toString() === String(productId) &&
      product.color === color
  );

  if (!targetProductWithReview) {
    return next(new AppError("Product not found in the order"));
  }
  targetProductWithReview.isRated = true;

  console.log("targetProductWithReview", targetProductWithReview);
  // Save both workshop user and product
  await Promise.all([user.save(), targetProduct.save(), targetOrder.save()]);

  res.status(200).json({ msg: "success", targetOrder });
});

export { getOneUser, modifyLoginStatus, addReview };
