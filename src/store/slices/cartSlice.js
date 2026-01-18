import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  error: null,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Recalculate total
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    addToCartError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set cart items (when fetching from server)
    setCartItems: (state, action) => {
      state.items = action.payload.items || [];
      // Recalculate total from items
      state.total = (action.payload.items || []).reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
        0
      );
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
});

export const {
  addToCartStart,
  addToCartSuccess,
  addToCartError,
  setCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
