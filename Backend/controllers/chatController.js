import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { generateAIResponse } from "../services/ai.js";

/* CREATE NEW CHAT */

export const createConversation = async (req, res) => {
  try {

    const conversation = await Conversation.create({
      title: "New Chat"
    });

    res.json(conversation);

  } catch (error) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
};


/* GET ALL CHATS */

export const getConversations = async (req, res) => {
  try {

    const conversations = await Conversation
      .find()
      .sort({ createdAt: -1 });

    res.json(conversations);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};


/* GET MESSAGES */

export const getMessages = async (req, res) => {
  try {

    const { id } = req.params;

    const messages = await Message
      .find({ conversationId: id })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};


/* SEND MESSAGE */

export const sendMessage = async (req, res) => {
  try {

    let { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    /* If conversation doesn't exist, create it automatically */

    let conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      conversation = await Conversation.create({
        title: "New Chat"
      });

      conversationId = conversation._id;
    }

    /* Generate AI response */

    const aiReply = await generateAIResponse(message);

    /* Save user message */

    await Message.create({
      conversationId,
      role: "user",
      content: message
    });

    /* Save AI message */

    await Message.create({
      conversationId,
      role: "assistant",
      content: aiReply
    });

    /* Update chat title if first message */

    if (conversation.title === "New Chat") {

      conversation.title = message.slice(0, 30);

      await conversation.save();
    }

    res.json({
      reply: aiReply,
      conversationId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Message processing failed"
    });

  }
};


/* DELETE CHAT */

export const deleteConversation = async (req, res) => {
  try {

    const { id } = req.params;

    await Message.deleteMany({ conversationId: id });

    await Conversation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Conversation deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: "Delete failed"
    });

  }
};