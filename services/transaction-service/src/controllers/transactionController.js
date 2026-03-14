import Transaction from '../models/Transaction.js';
import logger from '../config/logger.js';

/**
 * GET /transactions
 * Fetches paginated transaction history for the authenticated user.
 */
export const getHistory = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    
    const query = { userId };

    // Support filtering by type (e.g., DEPOSIT, WITHDRAWAL)
    if (type) {
      query.type = type.toUpperCase();
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Transaction.countDocuments(query);

    logger.info(`History fetched | User: ${userId} | Count: ${transactions.length}`);

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalTransactions: count
    });
  } catch (err) {
    logger.error('History fetch error: %o', { 
      userId: req.user?.id, 
      error: err.message 
    });
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

/**
 * POST /transactions/internal/record
 * Internal endpoint for Wallet Service to log financial movements.
 */
export const createRecord = async (req, res) => {
  try {
    const { userId, type, amount, balanceAfter } = req.body;

    // 1. Basic Validation
    if (!userId || !type || amount === undefined || balanceAfter === undefined) {
      logger.warn('Received incomplete transaction data: %o', req.body);
      return res.status(400).json({ error: "Missing required transaction fields" });
    }

    // 2. Create and Save
    const transaction = new Transaction({
      ...req.body,
      status: 'COMPLETED'
    });

    await transaction.save();

    // 3. Structured Logging
    logger.info('TXN SUCCESS | Ref: %s | Type: %s | User: %s | Amount: %d', 
      transaction.reference, 
      type, 
      userId, 
      amount
    );

    res.status(201).json(transaction);
  } catch (err) {
    logger.error('Internal record creation failed: %o', { 
      error: err.message, 
      payload: req.body 
    });
    res.status(500).json({ error: "Failed to create audit log" });
  }
};