// InputField.jsx
import React, { useState } from 'react';

const InputField = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showError = true,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
      <input
        id={id}
        type={type}
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
          ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-300
          transition-all duration-200
          ${error ? 'bg-red-50' : 'bg-white'}
          ${type === 'password' ? 'font-mono tracking-wider' : ''}
        `}
        {...props}
      />
      {showError && error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default InputField;