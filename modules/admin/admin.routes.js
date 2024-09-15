import express from "express";
import {
  getAllClients,
  getAllWorkshops,
  deleteClient,
} from "./admin.controller.js";
const adminRoutes = express.Router();

adminRoutes.get("/allclients", getAllClients);
adminRoutes.get("/allworkshops", getAllWorkshops);

adminRoutes.delete("/deleteclient/:email", deleteClient);

export default adminRoutes;
