import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversation", createConversation);

router.get("/conversations", getConversations);

router.delete("/conversation/:id", deleteConversation);

router.get("/messages/:id", getMessages);

router.post("/chat", sendMessage);

export default router;
