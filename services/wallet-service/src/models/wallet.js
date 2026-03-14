import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { 
    type: String, // Or mongoose.Schema.Types.ObjectId if using Mongo IDs
    required: true, 
    unique: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

export default mongoose.model("Wallet", walletSchema);