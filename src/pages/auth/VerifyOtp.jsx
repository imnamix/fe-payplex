import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../../services/authService";
import toast from "react-hot-toast";

const OTP_LENGTH = 4;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const digits = pasted.slice(0, OTP_LENGTH).split("");
    const newOtp = Array(OTP_LENGTH).fill("");

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);
    inputsRef.current[digits.length - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== OTP_LENGTH) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please register again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOTP(userId, enteredOtp);
      toast.success(response?.message || "OTP verified successfully!");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      toast.error(error?.message || "OTP verification failed");
      console.error("OTP verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("Email not found. Please register again.");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendOTP(userEmail);
      toast.success(response?.message || "OTP resent successfully!");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch (error) {
      toast.error(error?.message || "Failed to resend OTP");
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <h1
        className="
          absolute top-25 left-1/2 -translate-x-1/2
          text-4xl font-extrabold tracking-wide
          bg-gradient-to-r from-blue-600 to-indigo-600
          bg-clip-text text-transparent
          drop-shadow-sm
        "
      >
        Payplex
      </h1>

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-3 mb-6 px-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="
                    w-14 h-14 text-center text-2xl font-semibold
                    border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.includes("")}
              className={`
                w-full py-3 rounded-lg font-medium text-white
                ${
                  isSubmitting || otp.includes("")
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendOtp}
              className={`text-sm font-medium ${
                isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
