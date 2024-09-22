import mongoose from "mongoose";
import catchAsync from "../../handleErrors/catchAsync.js";
import cartModel from "../../models/cart.model.js";
import checkoutModel from "../../models/checkout.model.js";

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

const addToOrders = catchAsync(async function (req, res) {
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

  const newOrdersItem = new checkoutModel({
    userId,
    products,
    total,
    status,
    shippingAddress,
    paymentIntentId: paymentIntentId || "",
  });
  await newOrdersItem.save();
  await cartModel.deleteMany({
    userId: new mongoose.Types.ObjectId(userId),
  });
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

export { getOrders, addToOrders, updateStateProduct };
