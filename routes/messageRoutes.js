import express from "express"
import { allMessages, sendMessage, sendPhoto,deleteMessage } from "../controllers/messageController.js";
import verifyToken  from "../middlewares/verifyToken.js";
import { upload } from "../uploads/multer.js";

const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);
router.route("/photo").post(verifyToken, upload.single("photo"),sendPhoto);
router.route("/:messageId").delete(verifyToken,deleteMessage)
export default router;