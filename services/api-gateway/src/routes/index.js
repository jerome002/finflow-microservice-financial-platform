import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

const USER_SERVICE = process.env.USER_SERVICE_URL;
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL;

/**
 * forwardTo - A robust proxy handler
 * @param {string} serviceBaseUrl - The root URL of the microservice
 * @param {string} forcedPrefix - The prefix the microservice expects (e.g., /auth or /wallet)
 */
const forwardTo = (serviceBaseUrl, forcedPrefix) => async (req, res) => {
    // If req.url is "/balance", and forcedPrefix is "/wallet", 
    // result is https://service.com/wallet/balance
    const url = `${serviceBaseUrl.replace(/\/$/, "")}${forcedPrefix}${req.url}`;

    try {
        logger.info(`[Gateway] Proxying ${req.method} ${req.originalUrl} -> ${url}`);

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            params: req.query,
            headers: {
                // Pass the JWT token for the backend to verify if needed
                Authorization: req.headers.authorization || "",
                "Content-Type": "application/json"
            },
            // Prevent long-hanging requests
            timeout: 15000 
        });

        return res.status(response.status).json(response.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const errorData = err.response?.data || { message: err.message };

        logger.error(`[Gateway Error] ${status} from ${url}: ${JSON.stringify(errorData)}`);
        
        return res.status(status).json({
            error: "Service Error",
            details: errorData.message || errorData
        });
    }
};

// --- ROUTES MOUNTING ---

// 1. Auth Routes
// Frontend sends: /api/auth/register -> Gateway forwards to: USER_SERVICE/auth/register
router.use("/auth", forwardTo(USER_SERVICE, "/auth"));

// 2. Wallet Routes
// Frontend sends: /api/wallet/balance -> Gateway forwards to: WALLET_SERVICE/wallet/balance
// Note: We explicitly use "/wallet" here because the Wallet Service expects its routes 
// to be prefixed with /wallet internally.
router.use("/wallet", authenticate, forwardTo(WALLET_SERVICE, "/wallet"));

export default router;