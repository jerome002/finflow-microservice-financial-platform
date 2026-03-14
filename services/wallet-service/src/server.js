import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import walletRoutes from "./routes/walletRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", // Allows the Gateway to communicate freely
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

connectDB();

// 1. Ensure the leading slash is there
// 2. Ensure this is the ONLY place '/api/wallet' is mentioned
app.use("/wallet", walletRoutes); 

app.get("/", (req, res) => res.send("Wallet Service Running"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Wallet Service running on port ${PORT}`));