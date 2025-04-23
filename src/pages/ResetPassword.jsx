import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import resetBackground from "../assets/images/nature.png"; // Reuse the same background for consistency

const ResetPassword = () => {
  const { token, userId, userType } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/validate-reset-token/${token}/${userId}/${userType}`);
        const data = await response.json();
        
        setIsValidToken(data.valid);
        setIsLoading(false);
      } catch (err) {
        setIsValidToken(false);
        setIsLoading(false);
        setError("Unable to validate your reset token. Please try again.");
      }
    };

    validateToken();
  }, [token, userId, userType]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          userId,
          userType,
          newPassword
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      
      // Automatically redirect after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${resetBackground})` }}>
        <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md border border-green-300">
          <div className="text-center">
            <p className="text-gray-700">Validating your reset token...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="fixed inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${resetBackground})` }}>
        <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md border border-green-300">
          <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Invalid or Expired Link</h2>
          <p className="text-gray-700 mb-6">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <div className="text-center">
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${resetBackground})` }}>
      <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md border border-green-300">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          {success ? "Password Reset Successful" : "Reset Your Password"}
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;