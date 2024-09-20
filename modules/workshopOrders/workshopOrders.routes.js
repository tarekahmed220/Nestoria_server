import express from "express";

import { cancelProduct, getOrders, pendingOrders, shippedOrders, updateOrders } from "./workshopOrders.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const workshopOrdersRoutes = express.Router();

workshopOrdersRoutes.get("/getorders",verifyToken ,getOrders);
workshopOrdersRoutes.get("/pendingOrders",verifyToken, pendingOrders);
workshopOrdersRoutes.get("/shippedOrders",verifyToken, shippedOrders);
workshopOrdersRoutes.put("/updateOrders",verifyToken, updateOrders);
workshopOrdersRoutes.delete("/cancelProduct",verifyToken, cancelProduct);



export default workshopOrdersRoutes;
