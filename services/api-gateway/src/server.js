import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// Professional CORS setup for multiple environments
const allowedOrigins = [
  process.env.FRONTEND_URL,    // The Render URL
  "http://localhost:5173",     // Your Local Vite Dev URL
  "http://127.0.0.1:5173"      // Alternative local loopback
].filter(Boolean); // Removes undefined if FRONTEND_URL isn't set

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api", routes);

app.use(errorHandler);

app.get("/", (req, res) => res.send("FinFlow API Gateway Live"));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => logger.info(`Gateway active on port ${PORT}`));