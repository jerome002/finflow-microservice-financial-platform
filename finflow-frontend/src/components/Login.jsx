import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api/api"; 
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false); // Added for UX
  const [resendMessage, setResendMessage] = useState(""); // Added for feedback
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setResendMessage("");
    
    try {
      const res = await authAPI.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.details?.error || err.response?.data?.error || err.response?.data?.message;
      
      // Keep your specific logic for identifying the verification error
      if (errorMessage?.includes("verify your email first")) {
        setError("Email verification required. Check your inbox.");
      } else if (errorMessage?.includes("Invalid credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError(errorMessage || "Login failed. Please try again.");
      }
    }
  };

  /**
   * Action: Triggers the new Backend Controller
   */
  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      await authAPI.post("/auth/resend-verification", { email });
      setResendMessage("Verification email resent! Please check your inbox (and spam).");
      setError(""); // Clear the error once success happens
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to resend email.";
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="your@email.com"
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
            placeholder="••••••••"
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
          <Link to="/forgot-password" name="forgot" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Error Notification with functional Resend Button */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            <p> {error}</p>
            {error.includes("verify") && (
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="mt-2 text-blue-600 font-bold hover:underline block text-xs"
              >
                {resendLoading ? "Sending..." : "Didn't get the link? Click to Resend"}
              </button>
            )}
          </div>
        )}

        {/* Success Message for Resend */}
        {resendMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded font-medium">
             {resendMessage}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button 
            type="button"
            className="text-blue-500 font-semibold hover:underline" 
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}