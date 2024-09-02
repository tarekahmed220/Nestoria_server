//import { Cart } from "../models/cartModel.js";
import catchAsync from "../handleErrors/catchAsync.js"
import AppError from "../handleErrors/appError.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

// //create add to cart
const AddProductToCart = catchAsync(async (req, res, next) => {
  
    
    const productId = req.params.productId;
    req.body.product = req.body.product || productId;
    req.body.user = req.body.user || req.user.id;
    if(!productId){
        return next(new AppError("Product ID is required", 400));
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    const user = await User.findById(req.user.id);  
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (user.myCart.includes(productId)) {
        return next(new AppError("Product already in cart", 400));
    }

    user.myCart.push(productId);
    await user.save();

    res.status(200).json({
        msg: "Product added to cart successfully",
        data: { cart: user.myCart }
    });
});
const removeProductFromCart = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    req.body.product = req.body.product || id;
    req.body.user = req.body.user || req.user.id;
    if(!id){
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
        
    });
});
const getCart = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        msg: "success", 
        cart:user.myCart
    });
})
export { AddProductToCart, removeProductFromCart, getCart };

  