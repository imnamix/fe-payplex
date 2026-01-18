import axiosInstance from '../config/axiosInstance';

const API_BASE_URL = '/dashboard';

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get recent orders (admin only)
export const getRecentOrders = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/recent-orders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/all-users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/update-user-status`,
      { userId, status }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
