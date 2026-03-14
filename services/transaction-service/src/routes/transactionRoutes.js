import express from 'express';
import { getHistory, createRecord } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly accessible via Gateway (Authenticated by user)
router.get('/', authenticate, getHistory);

// Internal Service-to-Service Route (Called by Wallet Service)
// In production, you would restrict this to internal IPs only
router.post('/internal/record', createRecord);

export default router;