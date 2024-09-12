import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { addShippingAddress, getShippingAddress } from "./shippingAddress.controller.js";


const shippingAddressRoutes = express.Router();

shippingAddressRoutes.post("/addShippingAddress",verifyToken,addShippingAddress);
shippingAddressRoutes.get("/getShippingAddress", verifyToken, getShippingAddress);

export default shippingAddressRoutes;