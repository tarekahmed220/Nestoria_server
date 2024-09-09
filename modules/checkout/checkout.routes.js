import express from "express";
import {getOrders, addToOrders} from "./checkout.controller.js";

import verifyToken from "../../middlewares/verifyToken.js";

const ordersRoutes = express.Router();

ordersRoutes.get("/getOrdersProducts", verifyToken, getOrders);
ordersRoutes.post("/addOrders", verifyToken, addToOrders);

export default ordersRoutes;
