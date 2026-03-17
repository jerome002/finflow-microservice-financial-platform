import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      api.get(`/auth/verify/${token}`)
        .then(() => {
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch(() => {
          setMessage("Verification failed. Invalid or expired token.");
        });
    } else {
      setMessage("No verification token provided.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Email Verification</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;