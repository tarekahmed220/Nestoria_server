import mongoose from "mongoose";
import AppError from "../handleErrors/appError.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
import Workshop from "../models/workshopModel.js";
import { User } from "../models/userModel.js";
import { upload } from "../uploads/multer.js";
import { cloudinary } from "../uploads/cloudinary.js";
const getProductsByWorkshop = catchAsync(async (req, res, next) => {
  const { workshopId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * Number(limit);
  if (!mongoose.Types.ObjectId.isValid(workshopId)) {
    return next(new AppError("Invalid workshop ID", 400));
  }
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) {
    return next(new AppError("Workshop not found", 404));
  }
  const products = await Product.find({
    workshop_id: new mongoose.Types.ObjectId(workshopId),
  })
    .populate("workshop_id")
    .skip(skip)
    .limit(Number(limit))
    .exec();
  console.log(products);
  const totalProducts = await Product.countDocuments({
    workshop_id: new mongoose.Types.ObjectId(workshopId),
  });
  if (!products || products.length === 0) {
    return next(new AppError("No products found for this workshop", 404));
  }
  res.status(200).json({
    status: "success",
    results: products.length,
    totalProducts,
    products,
  });
});

const addWorkshop = catchAsync(async (req, res, next) => {
  const { name, description, location, contactEmail, phoneNumber } = req.body;

  const existingWorkshop = await Workshop.findOne({ name });
  if (existingWorkshop) {
    return next(new AppError("Workshop with this name already exists", 400));
  }

  const newWorkshop = await Workshop.create({
    name,
    description,
    location,
    contactEmail,
    phoneNumber,
    createdAt: new Date(),
  });

  res.status(201).json({
    status: "success",
    data: {
      workshop: newWorkshop,
    },
  });
});

const deleteWorkshop = catchAsync(async (req, res, next) => {
  const { workshopId } = req.params;

  const workshop = await Workshop.findByIdAndDelete(workshopId);

  if (!workshop) {
    return next(new AppError("No workshop found with this ID", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "workshop deleted successfully",
  });
});
const updateWorkshopProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const imageToUpload = req.file; // For single image upload
  if(user.cloudinary_id===undefined){

user.cloudinary_id="";


}
  // If no new image is provided, retain the existing photo and Cloudinary ID
  if (!imageToUpload) {
    req.body.photo = user.photo || "";
    req.body.cloudinary_id = user.cloudinary_id || "";
  } else {
    // Upload the new image to Cloudinary
    const result = await cloudinary.uploader.upload(imageToUpload.path);

    // Set the new photo URL and Cloudinary ID
    req.body.photo = result.secure_url;
    req.body.cloudinary_id = result.public_id;

    // Delete the old image from Cloudinary if it exists
    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }
  }

  // Update the user's profile with the new photo and Cloudinary ID
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
     updatedUser,
    
  });
});

  

  
export { getProductsByWorkshop, addWorkshop, deleteWorkshop ,updateWorkshopProfile};
