import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../../services/cartService";
import {
  setCartItems,
  removeFromCart as removeFromCartRedux,
  updateQuantity,
} from "../../store/slices/cartSlice";
import { placeOrder } from "../../services/orderService";
import Spinner from "../../components/common/Spinner";
import CheckoutModal from "../../components/product/CheckoutModal";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: cartItems,
    total,
    loading: cartLoading,
  } = useSelector((state) => state.cart);
  console.log("Cart rendered with items:", cartItems);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const fallbackImage =
    "https://img.freepik.com/premium-vector/image-available-icon_268104-3618.jpg?semt=ais_hybrid&w=740&q=80";

  // Fetch cart on mount
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCart();
      dispatch(
        setCartItems({
          items: response.cart,
          total: response.total,
        }),
      );
    } catch (err) {
      const errorMsg =
        typeof err === "string" ? err : err.message || "Failed to fetch cart";
      setError(errorMsg);
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [isAuthenticated, dispatch, navigate]);

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromCart(productId);
      // fetchCart();
      const response = await getCart();
      dispatch(
        setCartItems({
          items: response.cart,
          total: response.total,
        }),
      );
      dispatch(removeFromCartRedux(productId));
    } catch (err) {
      const errorMsg =
        typeof err === "string" ? err : err.message || "Failed to remove item";
      setError(errorMsg);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty <= 0) return;

    try {
      setUpdatingId(productId);
      await updateCartQuantity(productId, newQty);
      // Refetch cart to get updated data from server
      const response = await getCart();
      dispatch(
        setCartItems({
          items: response.cart,
          total: response.total,
        }),
      );
    } catch (err) {
      const errorMsg =
        typeof err === "string"
          ? err
          : err.message || "Failed to update quantity";
      setError(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleIncreaseQty = (item) => {
    handleUpdateQuantity(item.productId._id, item.quantity + 1);
  };

  const handleDecreaseQty = (item) => {
    if (item.quantity > 1) {
      handleUpdateQuantity(item.productId._id, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCheckoutConfirm = async () => {
    try {
      await placeOrder({});
      // Clear cart from Redux
      dispatch(
        setCartItems({
          items: [],
          total: 0,
        }),
      );
      // Redirect to orders page after a delay
      setTimeout(() => {
        navigate("/orders");
      }, 2500);
    } catch (err) {
      const errorMsg =
        typeof err === "string" ? err : err.message || "Failed to place order";
      throw new Error(errorMsg);
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const subtotal = total;
  const tax = Math.round(total * 0.1 * 100) / 100; // 10% tax
  const totalAmount = Math.round((total + tax) * 100) / 100;

  return (
    <div className="max-w-7xl mx-auto px-1 py-1">
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        total={total}
        onConfirm={handleCheckoutConfirm}
      />

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center gap-6 p-6 border border-gray-300 rounded-xl bg-white shadow-sm"
              >
                {/* Image */}
                <img
                  src={item.productId.images?.[0]?.url || fallbackImage}
                  alt={item.productId.productName}
                  className="w-24 h-24 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {item.productId.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.productId.category}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleDecreaseQty(item)}
                      disabled={updatingId === item.productId._id}
                      className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncreaseQty(item)}
                      disabled={updatingId === item.productId._id}
                      className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-xl font-semibold">
                    ₹{(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.productId.price.toFixed(2)} each
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveItem(item.productId._id)}
                  disabled={removingId === item.productId._id}
                  className="text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Items ({cartItems.length})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (estimated)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <hr className="my-6" />

            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleCheckout}
              className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={cartLoading}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <button
              onClick={handleContinueShopping}
              className="w-full mt-3 py-3 rounded-lg border font-medium hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>

            {/* Trust Info */}
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Free shipping on orders over ₹500
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                30-day return policy
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
