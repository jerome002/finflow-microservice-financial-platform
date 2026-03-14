import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

const USER_SERVICE = process.env.USER_SERVICE_URL; 
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL;

const forwardTo = (serviceBaseUrl) => async (req, res) => {
  try {
    // req.baseUrl is "/api/auth" or "/api/wallet"
    // req.url is the rest (e.g., "/register" or "/balance")
    
    // Step 1: Strip "/api" from the base to get the service path (/auth or /wallet)
    const servicePath = req.baseUrl.replace('/api', ''); 
    const url = `${serviceBaseUrl}${servicePath}${req.url}`;

    logger.info(`[Gateway] Proxying ${req.method} to: ${url}`);

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body, // The registration/login data
      params: req.query,
      headers: {
        // Essential: Pass the Authorization token if it exists
        Authorization: req.headers.authorization || "",
        "Content-Type": "application/json"
      }
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Backend Service Error" };
    
    logger.error(`[Gateway Error] ${status} from ${err.config?.url}`);
    res.status(status).json(data);
  }
};

// IMPORTANT: Do NOT add a prefix in the forwardTo() call anymore.
// The logic above handles it automatically using the mount point.
router.use("/auth", forwardTo(USER_SERVICE));
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE));

export default router;