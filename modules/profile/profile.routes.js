import express from "express";
import {
  getOneUser,
  modifyLoginStatus,
  addReview,
} from "./profile.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const profileRoutes = express.Router();

profileRoutes.get("/profile", verifyToken, getOneUser);
profileRoutes.get("/profile/logout", verifyToken, modifyLoginStatus);
profileRoutes.put("/profile/addreview", verifyToken, addReview);

export default profileRoutes;
