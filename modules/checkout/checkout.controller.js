import mongoose from "mongoose";
import catchAsync from "../../handleErrors/catchAsync.js";
import cartModel from "../../models/cart.model.js";
import checkoutModel from "../../models/checkout.model.js";

const getOrders = catchAsync(async function (req, res) {
  const userId = req.user.id;

  const ordersItems = await checkoutModel.find({ userId });
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

  const ordersItem = await checkoutModel.findOne({ userId });

  if (!ordersItem) {
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
  }

  res.json({ message: "Item already in orders" });
});

export { getOrders, addToOrders };
