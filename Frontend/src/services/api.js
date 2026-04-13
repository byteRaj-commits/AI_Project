import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getConversations = async () => {
  const res = await API.get("/conversations");
  return res.data;
};

export const createConversation = async () => {
  const res = await API.post("/conversation");
  return res.data;
};

export const deleteConversation = async (id) => {
  await API.delete(`/conversation/${id}`);
};

export const getMessages = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);
  return res.data;
};

export const sendMessageToAI = async (conversationId, message) => {
  const res = await API.post("/chat", {
    conversationId,
    message,
  });
  return res.data.reply;
};