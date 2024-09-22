import express from "express";
import { getOneUser, modifyLoginStatus } from "./profile.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const profileRoutes = express.Router();

profileRoutes.get("/profile", verifyToken, getOneUser);
profileRoutes.get("/profile/logout", verifyToken, modifyLoginStatus);

export default profileRoutes;
