import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
  updateStatusCoupon,
} from "./coupon.controller.js";
import express from "express";

const couponRoutes = express.Router();

couponRoutes.post("/addCoupon", createCoupon);
couponRoutes.delete("/deleteCoupon", deleteCoupon);
couponRoutes.put("/updateCoupon", updateCoupon);
couponRoutes.put("/updateStatusCoupon", updateStatusCoupon);
couponRoutes.get("/getAllCoupons", getAllCoupons);

export default couponRoutes;
