import React, { useEffect, useState } from 'react';
import { walletAPI } from '../api/api'; 
import { Clock, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, AlertCircle } from 'lucide-react';

const Activity = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Gateway proxies /api/transactions to Transaction Service (Port 5003)
        const res = await walletAPI.get('/transactions'); 
        
        // Backend returns { transactions: [...], ... }
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
        setError("Could not load your transaction history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_RECEIVE':
        return <div className="p-2 bg-green-100 rounded-lg"><ArrowDownLeft size={18} className="text-green-600" /></div>;
      case 'WITHDRAWAL':
      case 'TRANSFER_SEND':
        return <div className="p-2 bg-red-100 rounded-lg"><ArrowUpRight size={18} className="text-red-600" /></div>;
      default:
        return <div className="p-2 bg-blue-100 rounded-lg"><ArrowLeftRight size={18} className="text-blue-600" /></div>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <Clock size={32} className="text-blue-600" /> Transaction History
        </h1>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
          {transactions.length} Total Records
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-6 border border-red-100">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="bg-white shadow-xl shadow-gray-200/50 rounded-[2rem] overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-5 flex items-center gap-4">
                  {getIcon(txn.type)}
                  <div>
                    <span className="block font-bold text-gray-800 uppercase text-xs tracking-tight">
                      {txn.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">#{txn._id.slice(-8)}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 italic">
                  {txn.description || "System Transaction"}
                </td>
                <td className={`px-6 py-5 font-black text-lg ${
                  txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? '+' : '-'} 
                  {txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                  {new Date(txn.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock className="text-gray-300" size={30} />
            </div>
            <p className="text-gray-400 font-medium">No transactions found yet.</p>
            <p className="text-xs text-gray-300 mt-1">When you make a move, it'll show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;