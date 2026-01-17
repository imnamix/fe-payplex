// Register.jsx
import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    dob: "",
    password: "",
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value ? "" : "Name is required";
      case "address":
        return value ? "" : "Address is required";
      case "email":
        return validateEmail(value);
      case "contactNumber":
        return value ? "" : "Contact number is required";
      case "dob":
        return value ? "" : "Date of birth is required";
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "profilePhoto") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Example: FormData for file upload
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      setTimeout(() => {
        console.log("Register payload:", formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <h1
        className="
      mb-6
      text-4xl font-extrabold tracking-wide
      bg-gradient-to-r from-blue-600 to-indigo-600
      bg-clip-text text-transparent
      drop-shadow-sm
    "
      >
        Payplex
      </h1>

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Fill in your details</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name and Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="name"
                name="name"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                className="mb-0"
              />

              <InputField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                className="mb-0"
              />
            </div>

            {/* Contact Number and DOB Row */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="contactNumber"
                name="contactNumber"
                label="Contact Number"
                type="tel"
                placeholder="9876543210"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.contactNumber}
                className="mb-0"
              />

              <InputField
                id="dob"
                name="dob"
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dob}
                className="mb-0"
              />
            </div>
            <InputField
              id="address"
              name="address"
              label="Address"
              placeholder="Your address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
            />

            <InputField
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="●●●●●●"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />

            {/* Profile Photo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 rounded-lg font-medium
                ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
                text-white shadow-md
              `}
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
