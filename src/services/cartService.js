import api from '../config/axiosInstance';

// Add product to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get cart items
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update cart item quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await api.put(`/cart/update/${productId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
