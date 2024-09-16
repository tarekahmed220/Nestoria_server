import express from "express";

import { getOrders } from "./workshopOrders.controller.js";

const workshopOrdersRoutes = express.Router();

workshopOrdersRoutes.get("/getorders", getOrders);

export default workshopOrdersRoutes;
