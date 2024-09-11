
import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { updateAccount } from "./account.controller.js";

const accountRoutes = express.Router();

accountRoutes.put("/updateAccount", verifyToken, updateAccount);

export default accountRoutes;

