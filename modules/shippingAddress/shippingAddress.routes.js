import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { addShippingAddress, getShippingAddress, updateShippingAddress } from "./shippingAddress.controller.js";


const shippingAddressRoutes = express.Router();

shippingAddressRoutes.post("/addShippingAddress",verifyToken,addShippingAddress);
shippingAddressRoutes.get("/getShippingAddress", verifyToken, getShippingAddress);
shippingAddressRoutes.put("/updateShippingAddress",verifyToken,updateShippingAddress);

export default shippingAddressRoutes;