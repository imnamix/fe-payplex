import api from '../config/axiosInstance';

// Upload image and get URL
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/auth/upload-image', formData);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // Handle verification required response (403 status)
    if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
      return error.response.data;
    }
    throw error.response?.data || error.message;
  }
};

// Verify OTP
export const verifyOTP = async (userId, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Resend OTP
export const resendOTP = async (email) => {
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put('/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    
    const response = await api.post('/auth/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout
export const logoutUser = () => {
  // Redux will handle localStorage clearing via clearAuthData action
  return true;
};
