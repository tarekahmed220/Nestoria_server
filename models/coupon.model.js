import mongoose, { model, Schema } from "mongoose";

const couponSchema = new Schema({
  discount: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: Boolean, default: false },
});

const couponModel = model("Coupon", couponSchema);

export default couponModel;
