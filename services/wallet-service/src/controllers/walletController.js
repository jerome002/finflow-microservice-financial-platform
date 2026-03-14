import Wallet from "../models/wallet.js";

/**
 * Helper to extract user ID from the normalized request object.
 * Handles variations in JWT payload naming (id, _id, userId).
 */
const validateRequest = (req) => {
  const userId = req.user?.id || req.user?._id || req.user?.userId;
  if (!userId) throw new Error("User ID not found in token. Check your auth middleware.");
  return userId;
};

// --- CREATE WALLET ---
export const createWallet = async (req, res) => {
  try {
    const userId = validateRequest(req); // Extracts ID from JWT
    
    const existing = await Wallet.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: "Wallet already exists" });
    }

    const wallet = await Wallet.create({ 
      userId, 
      balance: 0  // Initializing with zero
    });

    res.status(201).json({ message: "Wallet created", wallet });
  } catch (err) {
    console.error("Creation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- GET BALANCE ---
export const getBalance = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) return res.status(404).json({ error: "Wallet not found. Please create one first." });

    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error("Get Balance Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- DEPOSIT ---
export const deposit = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount. Must be a positive number." });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, runValidators: true }
    );

    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json({ message: "Deposit successful", balance: wallet.balance });
  } catch (err) {
    console.error("Deposit Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- WITHDRAW ---
export const withdraw = async (req, res) => {
  try {
    const userId = validateRequest(req);
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err) {
    console.error("Withdraw Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- TRANSFER ---
export const transfer = async (req, res) => {
  try {
    const senderId = validateRequest(req);
    const { recipientId } = req.body;
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (senderId === recipientId) {
      return res.status(400).json({ error: "Cannot transfer to self" });
    }

    const senderWallet = await Wallet.findOne({ userId: senderId });
    const recipientWallet = await Wallet.findOne({ userId: recipientId });

    if (!senderWallet || !recipientWallet) {
      return res.status(404).json({ error: "Sender or recipient wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Atomic-like update (for better production safety, use MongoDB Transactions)
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    res.json({ message: "Transfer successful", senderBalance: senderWallet.balance });
  } catch (err) {
    console.error("Transfer Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};