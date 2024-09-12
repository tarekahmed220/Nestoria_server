import mongoose from "mongoose";
import catchAsync from "../../handleErrors/catchAsync.js";
import cartModel from "../../models/cart.model.js";
import checkoutModel from "../../models/checkout.model.js";

const getOrders = catchAsync(async function (req, res) {
  const userId = req.user.id;

  const ordersItems = await checkoutModel.find({ userId }).populate("products.productId").populate({
    path: "products.productId.workshop_id",
  });
  res.json(ordersItems);
});

const addToOrders = catchAsync(async function (req, res) {
  const { products, total, paymentIntentId = "", status = "unpaid" } = req.body;
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
    paymentIntentId: paymentIntentId || "",
  });
  await newOrdersItem.save();
  await cartModel.deleteMany({
    userId: new mongoose.Types.ObjectId(userId),
  });
  return res.json({ id: newOrdersItem._id });
});

export { getOrders, addToOrders };
