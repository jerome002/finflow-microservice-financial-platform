import { useState } from "react";
import { walletAPI } from "../api/api"; 
import { useNavigate } from "react-router-dom";
import { Send, Mail, CircleDollarSign, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Transfer() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Hits the Gateway -> Wallet Service
      await walletAPI.post("/wallet/transfer", { 
        toEmail: recipientEmail, 
        amount: parseFloat(amount) 
      });

      setMessage({ 
        type: "success", 
        text: `Successfully transferred Ksh ${amount} to ${recipientEmail}!` 
      });
      
      // Redirect to dashboard after a success
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      console.error("Transfer Error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Transfer failed. Check balance or recipient email." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4 text-indigo-600">
            <Send size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 text-center">Transfer Money</h2>
          <p className="text-gray-500 text-sm">Send funds instantly via email</p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Recipient Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Amount (Ksh)
            </label>
            <div className="relative">
              <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Feedback Message */}
          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p>{message.text}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition shadow-indigo-100 ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Processing..." : "Confirm Transfer"}
            </button>
            
            <button 
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full mt-4 text-gray-400 font-bold text-sm hover:text-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}