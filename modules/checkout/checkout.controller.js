import mongoose from "mongoose";
import catchAsync from "../../handleErrors/catchAsync.js";
import cart from "../../models/cart.model.js";
import checkoutModel from "../../models/checkout.model.js";
import { Product } from "../../models/productModel.js";

const getOrders = catchAsync(async function (req, res) {
  const userId = req.user.id;

  const ordersItems = await checkoutModel
    .find({ userId })
    .populate("products.productId")
    .populate({
      path: "products.productId.workshop_id",
    });
  res.json(ordersItems);
});

const addToOrders = catchAsync(async function (req, res, next) {
  const {
    products,
    total,
    paymentIntentId = "",
    status = "unpaid",
    shippingAddress,
  } = req.body;
  const userId = req.user.id;

  if (
    !products ||
    !total ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res.json({ message: "Enter valid data" });
  }

  let insufficientStock = false;
  let adjustedProducts = [...products];

  // Check product stock and adjust the cart if necessary
  for (let item of adjustedProducts) {
    const targetProduct = await Product.findById(item.productId);
    if (!targetProduct) {
      return next(new AppError(`Product not found: ${item.productId}`, 404));
    }

    // If the ordered quantity exceeds available stock, update the cart
    if (targetProduct.quantity < item.quantity) {
      item.quantity = targetProduct.quantity; // Adjust to max available quantity
      insufficientStock = true; // Flag to refuse payment and adjust cart
    }
  }

  // If any product had insufficient stock, adjust the cart and refuse the payment
  if (insufficientStock) {
    // Update the cart with the adjusted product quantities
    for (let item of adjustedProducts) {
      await cart.updateOne(
        {
          userId: new mongoose.Types.ObjectId(userId),
          "products.productId": item.productId,
        },
        { $set: { "products.$.quantity": item.quantity } }
      );
    }

    return res.status(400).json({
      message:
        "Insufficient stock for some products. Your cart has been updated.",
      adjustedProducts,
    });
  }

  // If stock is sufficient, create and save the order
  const newOrdersItem = new checkoutModel({
    userId,
    products,
    total,
    status,
    shippingAddress,
    paymentIntentId: paymentIntentId || "",
  });
  await newOrdersItem.save();

  // Clear the user's cart after order is placed
  await cart.deleteMany({
    userId: new mongoose.Types.ObjectId(userId),
  });

  // Reduce stock quantities after saving the order
  for (const item of adjustedProducts) {
    const targetProduct = await Product.findById(item.productId);
    targetProduct.quantity -= item.quantity;
    await targetProduct.save();
  }

  // Return the new order ID
  return res.json({ id: newOrdersItem._id });
});

const updateStateProduct = catchAsync(async function (req, res) {
  const userId = req.user.id;
  const { orderId, productId, color } = req.body;
  if (!userId) {
    return res.json("User not logged in");
  }
  if (!orderId || !productId || !color) {
    return res.json("Enter Data");
  }
  const order = await checkoutModel.findOne({
    userId,
    _id: orderId,
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const product = order.products.find(
    (item) => item.productId.toString() === productId && item.color === color
  );

  if (!product) {
    return res.json("Product not found in the order");
  }
  if (product.deliveryStatus === "Shipped") {
    product.deliveryStatus = "Delivered";
    await order.save();
    return res.json(product);
  } else {
    return res
      .status(400)
      .json({ message: "Product is not in 'Shipped' status" });
  }
});

const verifyStock = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { products } = req.body;

  let insufficientStock = false;
  const updatedProducts = [];

  for (let item of products) {
    const targetProduct = await Product.findById(item.productId);
    if (!targetProduct) {
      return next(new AppError(`Product not found: ${item.productId}`, 404));
    }

    // Adjust quantity if necessary
    if (targetProduct.quantity < item.quantity) {
      item.quantity = targetProduct.quantity;
      insufficientStock = true;

      // Update product quantity in user's cart in the DB
      await cart.updateOne(
        { userId, productId: item.productId, color: item.color },
        { $set: { quantity: item.quantity } }
      );
    }
    updatedProducts.push(item);
  }

  res.status(200).json({ adjusted: insufficientStock, updatedProducts });
});

export { getOrders, addToOrders, updateStateProduct, verifyStock };
