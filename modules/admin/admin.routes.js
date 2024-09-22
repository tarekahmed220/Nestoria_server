import express from "express";
import {
  getAllClients,
  getAllWorkshops,
  deleteClient,
  updateWorkshop,
  getWorkshopRequests,
  acceptanceState,
  createWorkshopTransfer,
  getAdminBalance,
  getWorkshopBalance,
  listCharges,
  moneyTransferRequests,
} from "./admin.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";
import roleCheck from "../../middlewares/roleCheck.js";
const adminRoutes = express.Router();

adminRoutes.get("/allclients", getAllClients);
adminRoutes.get("/allworkshops", getAllWorkshops);
adminRoutes.delete("/deleteclient/:email", deleteClient);
adminRoutes.put(
  "/updateworkshop",
  verifyToken,
  roleCheck("workshop"),
  updateWorkshop
);
adminRoutes.get("/workshoprequests", getWorkshopRequests);
adminRoutes.put("/acceptancestate/:email", acceptanceState);
adminRoutes.post("/create-transfer", createWorkshopTransfer);
adminRoutes.get("/money-requests", moneyTransferRequests);
adminRoutes.get("/list-charges", listCharges);
adminRoutes.get(
  "/get-admin-balance",
  verifyToken,
  roleCheck("admin"),
  getAdminBalance
);
adminRoutes.get(
  "/get-balance",
  verifyToken,
  roleCheck("workshop"),
  getWorkshopBalance
);

export default adminRoutes;
