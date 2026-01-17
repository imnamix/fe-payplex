import React, { useRef, useState } from "react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ NEW: Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 4).split("");
    const newOtp = ["", "", "", ""];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);

    const lastIndex = digits.length - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) return;

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("OTP Verified:", enteredOtp);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {/* Top-center Task */}
       <h1
        className="
    absolute top-25 left-1/2 -translate-x-1/2
    mb-6
      text-4xl font-extrabold tracking-wide
      bg-gradient-to-r from-blue-600 to-indigo-600
      bg-clip-text text-transparent
      drop-shadow-sm
  "
      >
        Payplex
      </h1>

      {/* Centered OTP Card */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600">
              Enter the 4-digit code sent to your email
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
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all"
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
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => console.log("Resend OTP")}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
