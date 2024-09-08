import express from "express";
import { getOneUser } from "./profile.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const profileRoutes = express.Router();

profileRoutes.get("/profile", verifyToken, getOneUser);

export default profileRoutes;
