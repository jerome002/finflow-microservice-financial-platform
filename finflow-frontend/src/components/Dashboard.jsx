import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { walletAPI } from "../api/api"; 
import { AuthContext } from "../context/AuthContext"; // Import your context

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [hasWallet, setHasWallet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Use logout from context instead of manual localStorage.clear
  const { logout, user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await walletAPI.get("/wallet/balance");
      setBalance(res.data.balance);
      setHasWallet(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setHasWallet(false);
      } else {
        setError("Unable to connect to your wallet. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    try {
      await walletAPI.post("/wallet/create");
      fetchBalance(); 
    } catch (err) {
      alert(err.response?.data?.error || "Error creating wallet");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Securing connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Welcome back, <span className="text-blue-600">{user?.name || "Member"}</span>
          </h1>
          <p className="text-gray-500">Here is what's happening with your money today.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {!hasWallet ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Activate Your Wallet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You're almost there! Create your secure digital wallet to start depositing and sending funds.
            </p>
            <button 
              onClick={handleCreateWallet}
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Initialize Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Balance</p>
                <h2 className="text-5xl md:text-6xl font-black">
                  Ksh {balance !== null ? balance.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
                </h2>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/deposit" className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition group">
                <div>
                  <p className="font-bold text-gray-800">Deposit</p>
                  <p className="text-xs text-gray-400">Add funds to wallet</p>
                </div>
              </Link>

              <Link to="/withdraw" className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition group">
                <div>
                  <p className="font-bold text-gray-800">Withdraw</p>
                  <p className="text-xs text-gray-400">Move to bank account</p>
                </div>
              </Link>

              <Link to="/transfer" className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition group">
                <div>
                  <p className="font-bold text-gray-800">Transfer</p>
                  <p className="text-xs text-gray-400">Send to a friend</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}