import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// Use the FRONTEND_URL from Env Vars (Render/Vercel)
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));

app.use(express.json());

// This is the "Entry Point" for all microservice traffic
app.use("/api", routes);

app.use(errorHandler);

app.get("/", (req, res) => res.send("FinFlow API Gateway Live"));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => logger.info(`Gateway active on port ${PORT}`));