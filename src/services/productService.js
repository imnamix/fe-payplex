import api from '../config/axiosInstance';

// Upload product images
export const uploadProductImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/products/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products/create', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all products
export const getAllProducts = async (page = 1, limit = 10, category = '', search = '') => {
  try {
    const params = {
      page,
      limit,
      ...(category && { category }),
      ...(search && { search }),
    };

    const response = await api.get('/products/all', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's products
export const getUserProducts = async (page = 1, limit = 10, status = '') => {
  try {
    const params = {
      page,
      limit,
      ...(status && { status }),
    };

    const response = await api.get('/products/my-products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get products by category
export const getProductsByCategory = async (category, page = 1, limit = 10) => {
  try {
    const params = {
      page,
      limit,
    };

    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
