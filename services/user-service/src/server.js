import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.GATEWAY_URL || "http://localhost:5000",
  credentials: true
}));
app.use(express.json());

// Connect MongoDB
connectDB();

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => res.send("User Service Running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));