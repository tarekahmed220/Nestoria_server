import express from "express";
import {
  addWorkshop,
  deleteWorkshop,
  getProductsByWorkshop,
} from "../controllers/workshopProfileController.js";

const router = express.Router();

router.post("/add", addWorkshop);

router.delete("/delete/:workshopId", deleteWorkshop);

router.get("/:workshopId", getProductsByWorkshop);

export default router;
