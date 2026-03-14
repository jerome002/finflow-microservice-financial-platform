import { useState } from "react";
// FIX: Named import for the Wallet Service
import { walletAPI } from "../api/api"; 
import { useNavigate } from "react-router-dom";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // FIX: Use walletAPI to hit Port 5002
      const res = await walletAPI.post("/wallet/deposit", { 
        amount: parseFloat(amount) 
      });

      setMessage({ type: "success", text: `Successfully deposited $${amount}!` });
      
      // Optional: Redirect back to dashboard after 2 seconds
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Deposit Error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Deposit failed" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Deposit Funds</h2>

        <form onSubmit={handleDeposit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 font-semibold">$</span>
              <input
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Confirm Deposit"}
          </button>
        </form>

        {message.text && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <button 
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 text-gray-500 text-sm hover:underline"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
}