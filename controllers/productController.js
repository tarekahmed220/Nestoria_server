import AppError from "../handleErrors/appError.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
import { upload } from "../uploads/multer.js";
import { deleteOne } from "./factory.js";
import { cloudinary } from "../uploads/cloudinary.js";
import { HomeProductsModel } from "../models/homeProductModel.js";
import plimit from "p-limit";
const uploadPhotos = upload.array("images", 2);

// Cloudinary and product creation logic
const createProduct = catchAsync(async (req, res, next) => {
  // Ensure that only 2 files are uploaded
  const imagesToUpload = req.files;
  if (imagesToUpload.length > 2) {
    return next(new AppError("You can't upload more than 2 images", 400));
  }

  // Upload images to Cloudinary
  const uploadPromises = imagesToUpload.map((file) =>
    cloudinary.v2.uploader.upload(file.path)
  );
  const imagesLinks = await Promise.all(uploadPromises);

  const images = imagesLinks.map((result) => ({
    secure_url: result.secure_url,
    public_id: result.public_id,
  }));

  // Assign user if not present in request body
  if (!req.body.user) req.body.user = req.user.id;

  // Destructure product details from the request body
  const {
    name,
    nameInArabic,
    price,
    description,
    descriptionInArabic,
    category,
    color,
    quantity,
  } = req.body;

  const colorsArray = Array.isArray(color) ? color : [color];
  // Create product with uploaded images
  const product = await Product.create({
    name,
    nameInArabic,
    price,
    category,
    description,
    descriptionInArabic,
    color: colorsArray,
    quantity,
    images: images.map((image) => image.secure_url),
    cloudinary_ids: images.map((image) => image.public_id),
    workshop_id: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const {
    category,
    keyword,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  const condition = {};

  if (category) {
    condition.category = category;
  }

  if (keyword) {
    condition.name = { $regex: ".*" + keyword + ".*", $options: "i" };
  }

  if (minPrice || maxPrice) {
    condition.price = {};
    if (minPrice) {
      condition.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      condition.price.$lte = parseFloat(maxPrice);
    }
  }

  const offset = (page - 1) * limit;

  const total = await Product.countDocuments(condition);

  const products = await Product.find(condition)
    .sort({ createdAt: -1 })
    .populate("workshop_id")
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    status: "success",
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    products,
  });
});

const getOneProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId).populate("ratings");
  // .populate("workshop_id");
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  res.status(200).json({ status: "success", data: { product } });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  const deletedProduct = await Product.findByIdAndDelete(product);
  res.status(204).json({ status: "success", data: null });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const imagesToUpload = req.files;

  // إذا لم يتم رفع أي صور جديدة، احتفظ بالصور القديمة
  if (!imagesToUpload || imagesToUpload.length === 0) {
    req.body.images = product.images; // الاحتفاظ بروابط الصور القديمة
    req.body.cloudinary_ids = product.cloudinary_ids; // الاحتفاظ بمعرفات Cloudinary القديمة
  } else {
    // رفع الصور الجديدة
    if (imagesToUpload.length > 2) {
      return next(new AppError("You can't upload more than 2 images", 400));
    }

    const uploadPromises = imagesToUpload.map((file) =>
      cloudinary.v2.uploader.upload(file.path)
    );
    const imagesLinks = await Promise.all(uploadPromises);

    const images = imagesLinks.map((result) => ({
      secure_url: result.secure_url,
      public_id: result.public_id,
    }));

    req.body.images = images.map((img) => img.secure_url);
    req.body.cloudinary_ids = images.map((img) => img.public_id);

    // بعد التأكد من رفع الصور الجديدة بنجاح، نقوم بحذف الصور القديمة
    if (product.cloudinary_ids && product.cloudinary_ids.length > 0) {
      const deletePromises = product.cloudinary_ids.map((public_id) =>
        cloudinary.v2.uploader.destroy(public_id)
      );
      await Promise.all(deletePromises);
    }
  }

  // تحديث المنتج
  const updatedOne = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: { updatedOne } });
});

// get home products

const getHomeProducts = catchAsync(async (req, res, next) => {
  const homeProducts = await HomeProductsModel.find().sort({ createdAt: -1 });

  res.status(200).json([{ msg: "success" }, { homeProducts }]);
});
const getWorkshopProducts = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const workshopProducts = await Product.find({
    workshop_id: req.body.user,
  }).sort({ createdAt: -1 });
  res.status(200).json({ msg: "success", workshopProducts });
});
export {
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  uploadPhotos,
  getWorkshopProducts,
  getHomeProducts,
};
