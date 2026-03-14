import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-xl font-black tracking-tighter text-blue-800">
          Fin<span className="text-blue-500">Flow</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {token ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600">Overview</Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-md transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600">Login</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
              >
                Open Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}