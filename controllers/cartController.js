//import { Cart } from "../models/cartModel.js";
import catchAsync from "../handleErrors/catchAsync.js"
import AppError from "../handleErrors/appError.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

// //create add to cart
const AddProductToCart = catchAsync(async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return next(new AppError("Product ID is required", 400));
    }

    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (user.myCart.includes(id)) {
        return next(new AppError("Product already in cart", 400));
    }

    user.myCart.push(id);
    await user.save();

    res.status(200).json({
        msg: "Product added to cart successfully",
        data: { cart: user.myCart }
    });
});
const removeProductFromCart = catchAsync(async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return next(new AppError("Product ID is required", 400));
    }

    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (!user.myCart.includes(id)) {
        return next(new AppError("Product not in cart", 400));
    }

    user.myCart = user.myCart.filter(productId => productId.toString() !== id);

    await user.save();

    res.status(200).json({
        msg: "Product removed from cart successfully",
        data: { cart: user.myCart }
    });
});

export { AddProductToCart, removeProductFromCart };

  