import express from "express";
import {
    getConversation,
    getAllConversations,
} from "../controllers/conversation.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/",verifyToken, getAllConversations);

export default router