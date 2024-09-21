import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import {
  addProblem,
  getCustomerComplaints,
  changeProblemStatus,
} from "./contactus.controller.js";

const problemsRoutes = express.Router();

problemsRoutes.post("/addProblem", verifyToken, addProblem);
problemsRoutes.post("/change-problem-state", changeProblemStatus);
problemsRoutes.get("/getComplaints", getCustomerComplaints);

export default problemsRoutes;
