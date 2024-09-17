import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { addProblem } from "./contactus.controller.js";


const problemsRoutes = express.Router();

problemsRoutes.post("/addProblem",verifyToken,addProblem);

export default problemsRoutes;