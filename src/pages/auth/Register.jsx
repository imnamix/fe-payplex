// Register.jsx
import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import ImagePreviewModal from "../../components/common/ImagePreviewModal";
import Spinner from "../../components/common/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, uploadImage } from "../../services/authService";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    dob: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const validateContactNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!number) return "Contact number is required";
    if (!phoneRegex.test(number))
      return "Please enter a valid 10-digit contact number";
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
        return validateContactNumber(value);
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

  // Handle profile photo selection and upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please select a valid image file (JPEG, JPG, PNG, GIF)");
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size must be less than 5MB");
      toast.error("File size must be less than 5MB");
      return;
    }

    setPhotoError("");
    setFormData((prev) => ({
      ...prev,
      profilePhoto: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image to server
    setIsUploadingPhoto(true);
    try {
      const response = await uploadImage(file);
      setProfilePhotoUrl(response.imageUrl);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      const errorMsg = error?.message || "Failed to upload photo";
      setPhotoError(errorMsg);
      toast.error(errorMsg);
      console.error("Photo upload error:", error);
      setPhotoPreview("");
      setFormData((prev) => ({
        ...prev,
        profilePhoto: null,
      }));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "profilePhoto") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    setIsSubmitting(true);

    try {
      const registerData = {
        name: formData.name,
        address: formData.address,
        email: formData.email,
        contactNumber: formData.contactNumber,
        dob: formData.dob,
        password: formData.password,
        profilePhoto: profilePhotoUrl || null,
      };

      const response = await registerUser(registerData);

      toast.success(
        response.message || "Registration successful! OTP sent to your email.",
      );

      localStorage.setItem("userId", response.userId);
      localStorage.setItem("userEmail", response.email);

      setTimeout(() => navigate("/verify-otp"), 200);
    } catch (err) {
      toast.error(
        err?.message || err?.error || "Registration failed. Please try again.",
      );
      console.error("Register error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setProfilePhotoUrl("");
    setPhotoError("");
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
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
                Profile Photo (Optional)
              </label>

              {!profilePhotoUrl && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={isUploadingPhoto}
                  className="block w-full text-sm text-gray-500
file:mr-4 file:py-2 file:px-4
file:rounded-lg file:border-0
file:text-sm file:font-medium
file:bg-blue-50 file:text-blue-700
hover:file:bg-blue-100"
                />
              )}

              {photoError && (
                <p className="text-red-600 text-sm mt-1">{photoError}</p>
              )}

              {photoPreview && (
                <div className="relative mt-4 inline-flex flex-col items-center gap-2">
                  {/* Image */}

                  {/* Spinner under image */}
                  {isUploadingPhoto ? (
                    <div className="w-15 h-15 object-cover rounded-lg border cursor-pointer hover:opacity-90">
                      <div className="mt-4">
                      <Spinner />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      onClick={() => setIsModalOpen(true)}
                      className="w-15 h-15 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                    />
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {profilePhotoUrl && !isUploadingPhoto && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Photo uploaded successfully
                </p>
              )}
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
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ImagePreviewModal
        isOpen={isModalOpen}
        image={photoPreview}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Register;
