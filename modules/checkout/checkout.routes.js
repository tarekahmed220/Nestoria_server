import express from "express";
import { getOrders, addToOrders, updateStateProduct } from "./checkout.controller.js";

import verifyToken from "../../middlewares/verifyToken.js";

const ordersRoutes = express.Router();

ordersRoutes.post("/addneworders", verifyToken, addToOrders);
ordersRoutes.get("/getordersproducts", verifyToken, getOrders);
ordersRoutes.put("/updateStateProduct",verifyToken,updateStateProduct);

export default ordersRoutes;
