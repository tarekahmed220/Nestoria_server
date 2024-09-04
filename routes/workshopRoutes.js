import express from "express";
import {
  addWorkshop,
  deleteWorkshop,
  getProductsByWorkshop,
} from "../controllers/workshopProfileController.js";

const router = express.Router();

router.post("/add", addWorkshop);

router.delete("/delete/:workshopId", deleteWorkshop);

router.get("/:workshopName/products", getProductsByWorkshop);

export default router;
