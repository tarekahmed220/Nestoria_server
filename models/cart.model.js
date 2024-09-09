import { model, Schema } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "clinet",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color:{
    type: String,
    required: true
  },
  status:{
    type: String,
    default: "",
  }
});

export default model("cart", cartSchema);
