import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

// Ensure URLs are stripped of trailing slashes
const USER_SERVICE = process.env.USER_SERVICE_URL?.replace(/\/$/, "");
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL?.replace(/\/$/, "");
const TRANSACTION_SERVICE = process.env.TRANSACTION_SERVICE_URL?.replace(/\/$/, "");

/**
 * forwardTo - A robust proxy handler
 * Handles internal communication and translates Gateway paths to Service paths
 */
const forwardTo = (serviceBaseUrl, forcedPrefix = "") => async (req, res) => {
    // If frontend hits /api/auth/login, req.url is "/login"
    // Final URL: https://service.com/auth/login
    const url = `${serviceBaseUrl}${forcedPrefix}${req.url}`;

    try {
        logger.info(`[Gateway] ${req.method} ${req.originalUrl} -> ${url}`);

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            params: req.query,
            headers: {
                // Critical: Pass the Bearer token for the sub-service to verify
                Authorization: req.headers.authorization || "",
                "Content-Type": "application/json"
            },
            // 30 second timeout - crucial for Render Free Tier "cold starts"
            timeout: 30000 
        });

        return res.status(response.status).json(response.data);
    } catch (err) {
        // Handle Timeout specifically for Render
        if (err.code === 'ECONNABORTED') {
            return res.status(504).json({
                error: "Gateway Timeout",
                details: "The microservice is taking too long to wake up. Please try again."
            });
        }

        const status = err.response?.status || 502;
        const errorData = err.response?.data || { message: err.message };

        logger.error(`[Gateway Error] ${status} from ${url}: ${JSON.stringify(errorData)}`);
        
        return res.status(status).json({
            error: "Service Error",
            details: errorData.message || errorData
        });
    }
};

// --- ROUTES MOUNTING ---

// 1. Auth & Profile (Maps to User Service)
router.use("/auth", forwardTo(USER_SERVICE, "/auth"));
router.use("/profile", authenticate, forwardTo(USER_SERVICE, "/profile"));

// 2. Wallet (Maps to Wallet Service)
// Note: Wallet Service uses app.use("/wallet", ...)
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE, "/wallet"));

// 3. Transactions (Maps to Transaction Service)
router.use("/transactions", authenticate, forwardTo(TRANSACTION_SERVICE, "/transactions"));

export default router;