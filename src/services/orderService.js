import api from '../config/axiosInstance';

// Place order (checkout)
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/cart/checkout', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user orders
export const getOrders = async () => {
  try {
    const response = await api.get('/cart/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/cart/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
