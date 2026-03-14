import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.GATEWAY_URL || "http://localhost:5000",
  credentials: true
}));
app.use(express.json());

connectDB();

// 1. Ensure the leading slash is there
// 2. Ensure this is the ONLY place '/api/wallet' is mentioned
app.use("/api/wallet", walletRoutes); 

app.get("/", (req, res) => res.send("Wallet Service Running"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Wallet Service running on port ${PORT}`));