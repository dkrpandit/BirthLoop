import { useState } from "react";
import { Mail, ArrowLeft, Key, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("email"); // email, otp, newPassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${serverUrl}/api/email-otp/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setSuccess("OTP sent successfully! Please check your email.");
      setCurrentStep("otp");
    } catch (error) {
      setError(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${serverUrl}/api/email-otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      setSuccess("OTP verified successfully!");
      setCurrentStep("newPassword");
    } catch (error) {
      setError(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // if (newPassword !== confirmPassword) {
    //   setError("Passwords do not match");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const response = await fetch(`${serverUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => {
              if (currentStep === "otp") setCurrentStep("email");
              else if (currentStep === "newPassword") setCurrentStep("otp");
              else navigate("/login");
            }}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStep === "email" && "Forgot Password"}
            {currentStep === "otp" && "Verify OTP"}
            {currentStep === "newPassword" && "Reset Password"}
          </h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

        {currentStep === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">We'll send a verification code to this email.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {currentStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter verification code
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the 6-digit code"
                  maxLength="6"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">We sent a code to {email}</p>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow hover:bg-indigo-500 transition disabled:opacity-50">
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {currentStep === "newPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full rounded-lg border-gray-300 px-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter new password" minLength="6" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow hover:bg-indigo-500 transition disabled:opacity-50">
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
