import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes at /transactions to match Gateway proxying
app.use('/transactions', transactionRoutes);

// Health check
app.get('/', (req, res) => res.send('Transaction Service Active'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Transaction Service running on port ${PORT}`));