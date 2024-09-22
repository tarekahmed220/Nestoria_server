import express from "express";
import{
  accessChat,
  fetchChats,
 

} from"../controllers/chatController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);

export default router;