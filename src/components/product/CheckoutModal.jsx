import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import Spinner from "../common/Spinner";

const CheckoutModal = ({ isOpen, onClose, cartItems, total, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const tax = Math.round(total * 0.1 * 100) / 100; // 10% tax
  const totalAmount = Math.round((total + tax) * 100) / 100;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");
      await onConfirm();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMsg =
        typeof err === "string" ? err : err.message || "Failed to place order";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Order Confirmation
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600 text-sm">
              Your order has been confirmed and will be processed soon.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!success && (
          <>
            {/* Order Summary */}
            <div className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Items Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Order Items ({cartItems.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.productId.productName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center bg-indigo-50 p-3 rounded-lg">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="text-xl font-bold text-indigo-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Confirmation Message */}
              {/* <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Please review your order carefully. Once confirmed, this
                  action cannot be undone.
                </p>
              </div> */}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
