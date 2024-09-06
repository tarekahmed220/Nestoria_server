import mongoose from "mongoose";
import AppError from "../handleErrors/appError.js";
import catchAsync from "../handleErrors/catchAsync.js";
import { Product } from "../models/productModel.js";
import Workshop from "../models/workshopModel.js";

const getProductsByWorkshop = catchAsync(async (req, res, next) => {
  const { workshopId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  console.log("Received workshopId:", workshopId);

  const skip = (page - 1) * Number(limit);

  if (!mongoose.Types.ObjectId.isValid(workshopId)) {
    return next(new AppError("Invalid workshop ID", 400));
  }

  const workshop = await Workshop.findById(workshopId);
  console.log("workshop", workshop);

  if (!Workshop) {
    return next(new AppError("Workshop not found", 404));
  }

  const products = await Product.find({
    workshop_id: new mongoose.Types.ObjectId(workshopId),
  })
    // .populate("Workshop")
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

export { getProductsByWorkshop, addWorkshop, deleteWorkshop };
