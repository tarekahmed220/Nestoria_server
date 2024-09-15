import "dotenv/config";
import express from "express";
import { dbConnect } from "./dbConnect.js";
import { Product } from "./models/productModel.js";
import AppError from "./handleErrors/appError.js";
import globalErrorHandler from "./handleErrors/globalError.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { dirname } from "path";

import path from "path";
import cartRoutes from "./modules/cart/cart.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import ordersRoutes from "./modules/checkout/checkout.routes.js";
import passwordRoutes from "./modules/changePassword/password.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const __dirname = path.resolve();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200",
  "https://nestoria-workshop-front.vercel.app/",
  "https://nestoria-user-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// app.use(express.static(__dirname + "../uploads"));//work with react//
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dbConnect();

//test middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//payment
app.use("/api/payment", paymentRoutes);

app.use("/api/v1/fur/auth", authRoutes);
app.use("/api/v1/fur/users", userRoutes);
app.use("/api/v1/fur/rates", ratingRoutes);
app.use("/api/v1/fur/favorites", favoriteRoutes);
app.use("/api/v1/fur/products", productRoutes);
app.use("/api/v1/fur/workshops", workshopRoutes);
app.use(cartRoutes);
app.use(couponRoutes);
app.use("/api/v1/fur/", profileRoutes);
app.use("/api/v1/fur/orders/", ordersRoutes);
app.use("/api/v1/fur/password/", passwordRoutes);
app.use("/api/v1/admin", adminRoutes);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  ); //update here by return//class AppError extends Error
});

//exports.ErrorRequestHandler if next function is error
app.use(globalErrorHandler);

export default app;
