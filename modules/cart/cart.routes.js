import express from "express";

import {
  addToCart,
  removeFromCart,
  updateCart,
  getCartCount,
  getCartItems,
} from "./cart.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const cartRoutes = express.Router();

cartRoutes.get("/getCartPrducts", verifyToken, getCartItems);
cartRoutes.post("/addToCart", verifyToken, addToCart);
cartRoutes.get("/cartCount", verifyToken, getCartCount);
cartRoutes.put("/updateCart", verifyToken, updateCart);
cartRoutes.delete("/removeFromCart/:productId", verifyToken, removeFromCart);

export default cartRoutes;
