import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

const USER_SERVICE = process.env.USER_SERVICE_URL;
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL;

const forwardTo = (serviceBaseUrl, serviceNamespace) => async (req, res) => {
  try {
    // req.url contains the path after the mount point (e.g., /register)
    // url results in: https://user-service.onrender.com/auth/register
    const url = `${serviceBaseUrl}${serviceNamespace}${req.url}`;

    logger.info(`[Gateway] Proxying ${req.method} to: ${url}`);

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      params: req.query,
      headers: {
        Authorization: req.headers.authorization || "",
        "Content-Type": "application/json"
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message;
    
    logger.error(`[Gateway Error] Target: ${url} | Status: ${status} | Message: ${message}`);
    
    res.status(status).json({ 
      error: "Service Error", 
      details: message 
    });
  }
};

// MOUNTING
router.use("/auth", forwardTo(USER_SERVICE, "/auth"));
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE, ""));

export default router;