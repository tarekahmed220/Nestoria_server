import { model, Schema } from "mongoose";

const checkoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        deliveryStatus: {
          type: String,
          enum: ["Processing", "Shipped", "Delivered"],
          default: "Processing",
        },
        paymentApprove: {
          type: Boolean,
          default: false,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "shipped"],
      default: "unpaid",
    },
    shippingAddress: {
      houseNumber: {
        type: String,
        required: true,
      },
      apartment: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    paymentIntentId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("order", checkoutSchema);
