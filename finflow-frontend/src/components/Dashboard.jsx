import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { walletAPI } from "../api/api"; 
import { AuthContext } from "../context/AuthContext";
import { ArrowUpRight, ArrowDownLeft, History, Wallet } from "lucide-react";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [hasWallet, setHasWallet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Removed 'logout' as it is handled by the Navbar
  const { user, setUser, token } = useContext(AuthContext); 

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch balance from Wallet Service via Gateway
      const balanceRes = await walletAPI.get("/wallet/balance");
      setBalance(balanceRes.data.balance);
      setHasWallet(true);

      // Fetch recent transactions (Gateway proxies this to Transaction Service)
      const txnRes = await walletAPI.get("/transactions?limit=3");
      // Note: Adjust 'txnRes.data.transactions' based on your exact API response structure
      setRecentTransactions(txnRes.data || []);

    } catch (err) {
      if (err.response?.status === 404) {
        setHasWallet(false);
      } else {
        setError("Unable to connect to financial services. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    try {
      await walletAPI.post("/wallet/create");
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.error || "Error creating wallet");
    }
  };

  useEffect(() => {
    if (token && !user) {
      // Fetch user profile if token exists but user data is missing
      walletAPI.get('/profile').then(res => setUser(res.data.user)).catch(() => {});
    }
    fetchData();
  }, [token, user]);

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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded-r-xl">
            {error}
          </div>
        )}

        {!hasWallet ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Wallet className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Activate Your Wallet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Create your secure digital wallet to start depositing and sending funds.
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
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Balance</p>
                <h2 className="text-5xl md:text-6xl font-black">
                  Ksh {balance !== null ? balance.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
                </h2>
              </div>
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/deposit" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition text-center group">
                 <div className="bg-green-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <ArrowDownLeft size={20} />
                 </div>
                 <p className="font-bold text-gray-800 text-sm">Deposit</p>
              </Link>

              <Link to="/withdraw" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition text-center group">
                 <div className="bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <ArrowUpRight size={20} />
                 </div>
                 <p className="font-bold text-gray-800 text-sm">Withdraw</p>
              </Link>

              <Link to="/transfer" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition text-center group">
                 <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowUpRight size={20} className="rotate-45" />
                 </div>
                 <p className="font-bold text-gray-800 text-sm">Transfer</p>
              </Link>

              <Link to="/activity" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 transition text-center group">
                 <div className="bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <History size={20} />
                 </div>
                 <p className="font-bold text-gray-800 text-sm">History</p>
              </Link>
            </div>

            {/* Recent Activity Summary Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Recent Activity</h3>
                <Link to="/activity" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((txn) => (
                    <div key={txn._id} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{txn.type.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-400">{new Date(txn.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVE' ? '+' : '-'} {txn.amount.toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">No recent transactions.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
} 