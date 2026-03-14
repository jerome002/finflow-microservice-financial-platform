import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Fix: Use curly braces for named import and use authAPI (Port 5000)
import { authAPI } from "../api/api"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Fix: Use authAPI instead of API to hit the correct port
      await authAPI.post("/auth/register", { name, email, password });
      
      // Redirect to login after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      // Catch specific error messages from the backend
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="mb-4">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded font-semibold hover:bg-green-600 transition duration-200"
        >
          Register
        </button>

        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
            {error}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span 
            className="text-blue-500 cursor-pointer hover:underline" 
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}