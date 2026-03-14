// routes/index.js
import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

const USER_SERVICE = process.env.USER_SERVICE_URL;
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL;

const forwardTo = (serviceUrl, prefix) => async (req, res, next) => {
  try {
    // req.url contains everything AFTER the matched route (e.g., /balance)
    // prefix is the base (e.g., /wallet)
    const url = `${serviceUrl}${prefix}${req.url}`;

    logger.info(`[Gateway] Forwarding ${req.method} ${req.originalUrl} -> ${url}`);

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: { 
        ...req.headers, 
        host: new URL(serviceUrl).host 
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Service Unavailable" };
    
    logger.error(`[Gateway Error] ${err.method} ${req.originalUrl} -> ${err.message}`);
    res.status(status).json(data);
  }
};

// Mount the services with their specific base prefixes
router.use("/auth", forwardTo(USER_SERVICE, "/auth"));
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE, "/wallet"));

export default router;