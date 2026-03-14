import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getBalance, deposit, withdraw, transfer, createWallet } from "../controllers/walletController.js";

const router = express.Router();

// Routes are relative to "/api/wallet"
// So this becomes GET /api/wallet/balance
router.get("/balance", authenticate, getBalance);
router.post("/deposit", authenticate, deposit);
router.post("/withdraw", authenticate, withdraw);
router.post("/transfer", authenticate, transfer);
router.post("/create", authenticate, createWallet);

export default router;