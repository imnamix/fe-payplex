import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showError = true,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-lg border-2
            ${error ? "border-red-500" : isFocused ? "border-blue-500" : "border-gray-300"}
            focus:outline-none focus:ring-2 focus:ring-blue-300
            transition-all duration-200
            ${error ? "bg-red-50" : "bg-white"}
            ${isPassword ? "pr-12" : ""}
          `}
          {...props}
        />

        {/* 👁 Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {showError && error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default InputField;
