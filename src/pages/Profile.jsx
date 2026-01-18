import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Camera, Edit2, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { getUserProfile, updateUserProfile } from "../services/authService";
import { setAuthData } from "../store/slices/authSlice";
import Spinner from "../components/common/Spinner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user from Redux
  const { user: currentUser } = useSelector((state) => state.auth);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactNumber: "",
    dob: "",
  });

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        console.log('Profile response:', response);
        const userData = response.user || currentUser;

        if (userData) {
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            address: userData.address || "",
            contactNumber: userData.contactNumber || "",
            dob: userData.dob ? userData.dob.split("T")[0] : "",
            status: userData.status || "",
            role: userData.role || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setProfilePhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error("Contact number is required");
      return;
    }

    if (formData.contactNumber.length !== 10) {
      toast.error("Contact number must be 10 digits");
      return;
    }

    if (!formData.dob) {
      toast.error("Date of birth is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart/form-data (needed for file upload)
      const updateFormData = new FormData();
      updateFormData.append("name", formData.name);
      updateFormData.append("email", formData.email);
      updateFormData.append("address", formData.address);
      updateFormData.append("contactNumber", formData.contactNumber);
      updateFormData.append("dob", formData.dob);

      // Add photo if selected
      if (profilePhoto) {
        updateFormData.append("profilePhoto", profilePhoto);
      }

      // API call
      const response = await updateUserProfile(updateFormData);

      // Update Redux store
      if (response.user) {
        dispatch(
          setAuthData({
            token: localStorage.getItem("token"),
            user: response.user,
          })
        );
      }

      setIsEditing(false);
      setProfilePhoto(null);
      setPreviewPhoto(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfilePhoto(null);
    setPreviewPhoto(null);

    // Reset form to current user data
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        contactNumber: currentUser.contactNumber || "",
        dob: currentUser.dob ? currentUser.dob.split("T")[0] : "",
      });
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const displayUser = currentUser;
  const photoUrl =
    previewPhoto || 
    (displayUser?.profilePhoto?.url || displayUser?.profilePhoto) ||
    "https://via.placeholder.com/150?text=No+Photo";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? "Update your profile information"
              : "View and manage your profile"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Photo Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {/* Photo */}
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover bg-gray-100"
                />

                {/* Photo Upload Button (only in edit mode) */}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition shadow-lg">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-24 px-8 pb-8">
            {/* Edit/Save Button */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Save size={18} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.address}</p>
                )}
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {formData.contactNumber}
                    </p>
                  )}
                </div>

                {/* Date of Birth Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Section (Display Only) */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Status:</span>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {displayUser?.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Role:</span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      {displayUser?.role || "user"}
                    </span>
                  </div>
            
                </div>
              </div>

            
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
