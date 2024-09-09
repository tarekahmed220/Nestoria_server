import { model, Schema } from "mongoose";

const checkoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "clinet",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    }
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  }
});

export default model("order", checkoutSchema);
