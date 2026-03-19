import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/api"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New: Prevent double submissions
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      // Hits the Auth Service via the Gateway
      await authAPI.post("/auth/register", { name, email, password });
      
      // Senior move: Provide success feedback before navigating
      alert("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);

      // Handle the specific nested error structure from your backend
      const backendError = err.response?.data?.details?.error || 
                           err.response?.data?.message || 
                           "Registration failed. Please try again.";

      if (backendError === "Email already exists") {
        setError("This email is already registered. Try logging in!");
      } else {
        setError(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="text"
              placeholder="Your Full Name."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full mt-6 p-3 rounded-md font-bold text-white transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-lg"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            type="button"
            className="text-green-600 font-semibold hover:underline" 
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}