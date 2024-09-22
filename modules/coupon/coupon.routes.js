import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "./coupon.controller.js";
import express from "express";

const couponRoutes = express.Router();

couponRoutes.post("/addCoupon", createCoupon);
couponRoutes.delete("/deleteCoupon/:id", deleteCoupon);
couponRoutes.put("/updateCoupon/:id", updateCoupon);
couponRoutes.get("/getAllCoupons", getAllCoupons);

export default couponRoutes;
