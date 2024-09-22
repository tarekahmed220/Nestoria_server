import express from "express";
import {
  addWorkshop,
  deleteWorkshop,
  getProductsByWorkshop,
  updateWorkshopProfile,
} from "../controllers/workshopProfileController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../uploads/multer.js";
const router = express.Router();

router.post("/add", addWorkshop);

router.delete("/delete/:workshopId", deleteWorkshop);

router.get("/:workshopId", getProductsByWorkshop);
router.patch("/updateworkshop", verifyToken,upload.single("personalPhoto"),updateWorkshopProfile);
export default router;
