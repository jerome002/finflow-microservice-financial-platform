import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  type: { 
    type: String, 
    enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_SEND', 'TRANSFER_RECEIVE'], 
    required: true 
  },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true }, // Audit trail
  status: { type: String, enum: ['COMPLETED', 'FAILED', 'PENDING'], default: 'COMPLETED' },
  description: { type: String },
  relatedUser: { type: mongoose.Schema.Types.ObjectId }, // ID of person sent to/received from
  reference: { 
    type: String, 
    unique: true, 
    default: () => `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);