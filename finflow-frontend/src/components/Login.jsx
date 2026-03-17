import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
// Fix: Use curly braces for named import and use authAPI
import { authAPI } from "../api/api"; 
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      // Fix: Use authAPI instead of API
      const res = await authAPI.post("/auth/login", { email, password });
      
      // Update context and storage
      login(res.data.token, res.data.user);
      
      // Redirect to dashboard
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Login Error:", err);
      // Detailed error message from server or fallback
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600 transition duration-200"
          type="submit"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
            {error}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span 
            className="text-blue-500 cursor-pointer hover:underline" 
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}