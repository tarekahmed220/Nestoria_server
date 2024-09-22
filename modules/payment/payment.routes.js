import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { handlePayment } from "./payment.controller.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-payment-intent", verifyToken, handlePayment);

export default paymentRoutes;
