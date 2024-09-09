
import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { updatePassword } from "./password.controller.js";

const passwordRoutes = express.Router();

passwordRoutes.put("/updatePassword", verifyToken, updatePassword);

export default passwordRoutes;

