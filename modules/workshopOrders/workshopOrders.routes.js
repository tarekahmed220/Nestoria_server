import express from "express";

import { getOrders } from "./workshopOrders.controller.js";

const workshopOrdersRoutes = express.Router();

workshopOrdersRoutes.post("/getorders", getOrders);

export default workshopOrdersRoutes;
