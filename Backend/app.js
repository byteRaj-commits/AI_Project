import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.Allow_Origin,
}));
app.use(express.json());

app.use("/api", chatRoutes);

export default app;