import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name require!"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    nameInArabic: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      min: 1,
      max: 1000000000000,
      required: [true, "Please enter price"],
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    descriptionInArabic: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    cloudinary_ids: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["created", "pending", "selled"],
      default: "created",
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      min: 0,
      max: 100000000000000,
    },

    color: {
      type: [String], // تعريفه كمصفوفة من السلاسل النصية
      required: true,
    },

    ratingsAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (value) => Math.round(value * 10) / 10, // 4.6666 => 4.7
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    workshop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
productSchema.virtual("ratings", {
  ref: "Rating",
  foreignField: "Product",
  localField: "_id",
});

productSchema.virtual("favorites", {
  ref: "Favorite",
  foreignField: "Product",
  localField: "_id",
});

export const Product = model("Product", productSchema);
