import Wallet from "../models/wallet.js";
import axios from "axios";
import { sendTransactionNotification } from "../services/emailService.js";

// Helper to get user email
const getUserEmail = async (userId, token) => {
  try {
    const USER_URL = process.env.USER_SERVICE_URL || "http://localhost:5001";
    const response = await axios.get(`${USER_URL}/profile/${userId}`, {
      headers: { Authorization: token }
    });
    return response.data.email;
  } catch (err) {
    console.error("Failed to get user email:", err.message);
    return null;
  }
};

const validateRequest = (req) => {
  const userId = req.user?.id || req.user?._id || req.user?.userId;
  if (!userId) throw new Error("User ID not found in token.");
  return userId;
};

export const createWallet = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const existing = await Wallet.findOne({ userId });
    if (existing) return res.status(400).json({ error: "Wallet already exists" });

    const wallet = await Wallet.create({ userId, balance: 0 });
    res.status(201).json({ message: "Wallet created", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found." });
    res.json({ balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deposit = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const amount = Number(req.body.amount);
    const token = req.headers.authorization;

    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount." });

    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    await logTransaction({
      userId,
      type: 'DEPOSIT',
      amount,
      balanceAfter: wallet.balance,
      description: 'Funds added via Dashboard'
    }, token);

    // Send notification
    const email = await getUserEmail(userId, token);
    if (email) {
      try {
        await sendTransactionNotification(email, 'DEPOSIT', amount);
      } catch (err) {
        console.error("Notification failed:", err.message);
      }
    }

    res.json({ message: "Deposit successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const withdraw = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const amount = Number(req.body.amount);
    const token = req.headers.authorization;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) return res.status(400).json({ error: "Insufficient funds" });

    wallet.balance -= amount;
    await wallet.save();

    await logTransaction({
      userId,
      type: 'WITHDRAWAL',
      amount,
      balanceAfter: wallet.balance,
      description: 'ATM Withdrawal/Payout'
    }, token);

    // Send notification
    const email = await getUserEmail(userId, token);
    if (email) {
      try {
        await sendTransactionNotification(email, 'WITHDRAWAL', amount);
      } catch (err) {
        console.error("Notification failed:", err.message);
      }
    }

    res.json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const transfer = async (req, res) => {
  try {
    const senderId = validateRequest(req);
    const { recipientId } = req.body;
    const amount = Number(req.body.amount);
    const token = req.headers.authorization;

    if (senderId === recipientId) return res.status(400).json({ error: "Cannot transfer to self" });

    const senderWallet = await Wallet.findOne({ userId: senderId });
    const recipientWallet = await Wallet.findOne({ userId: recipientId });

    if (!senderWallet || !recipientWallet) return res.status(404).json({ error: "Wallet not found" });
    if (senderWallet.balance < amount) return res.status(400).json({ error: "Insufficient funds" });

    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    await logTransaction({
      userId: senderId,
      type: 'TRANSFER_SEND',
      amount,
      balanceAfter: senderWallet.balance,
      relatedUser: recipientId,
      description: `Sent money to ${recipientId}`
    }, token);
// Send notification to sender
    const email = await getUserEmail(senderId, token);
    if (email) {
      try {
        await sendTransactionNotification(email, 'TRANSFER', amount);
      } catch (err) {
        console.error("Notification failed:", err.message);
      }
    }

    
    await logTransaction({
      userId: recipientId,
      type: 'TRANSFER_RECEIVE',
      amount,
      balanceAfter: recipientWallet.balance,
      relatedUser: senderId,
      description: `Received money from ${senderId}`
    }, token);

    res.json({ message: "Transfer successful", senderBalance: senderWallet.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};