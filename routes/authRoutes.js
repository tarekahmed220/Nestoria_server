import express from "express";
// import emailCheck from "../middlewares/emailCheck.js"
import roleCheck from "../middlewares/roleCheck.js";

import verifyAccount from "../middlewares/vieifyAccount.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  
  verifyRole,
  verifyWorkshopRole,
  applyAcceptance,

} from "../controllers/authController.js";
import { validation } from "../validation/validation.js";
import {
  userLogIn,
  userValidationSchema,
} from "../validation/userValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/signup", validation(userValidationSchema), signup);
router.post("/login", validation(userLogIn), login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.get("/verify/:token", verifyAccount);

router.get("/verifyrole", verifyToken, roleCheck("admin"), verifyRole);
router.get(
  "/verifyworkshoprole",
  verifyToken,
  roleCheck("workshop"),
  verifyWorkshopRole
);
router.get(
  "/applyacceptance",
  verifyToken,
  roleCheck("workshop"),
  applyAcceptance
);
export default router;
