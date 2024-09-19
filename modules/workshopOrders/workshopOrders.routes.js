import express from "express";

import { cancelProduct, getOrders, pendingOrders, shippedOrders, updateOrders } from "./workshopOrders.controller.js";

const workshopOrdersRoutes = express.Router();

workshopOrdersRoutes.post("/getorders", getOrders);
workshopOrdersRoutes.post("/pendingOrders", pendingOrders);
workshopOrdersRoutes.post("/shippedOrders", shippedOrders);
workshopOrdersRoutes.put("/updateOrders", updateOrders);
workshopOrdersRoutes.delete("/cancelProduct", cancelProduct);



export default workshopOrdersRoutes;
