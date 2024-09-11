import express from "express";
import { getOrders, addToOrders } from "./checkout.controller.js";

import verifyToken from "../../middlewares/verifyToken.js";

const ordersRoutes = express.Router();

ordersRoutes.post("/addneworders", verifyToken, addToOrders);
ordersRoutes.get("/getordersproducts", verifyToken, getOrders);

export default ordersRoutes;
