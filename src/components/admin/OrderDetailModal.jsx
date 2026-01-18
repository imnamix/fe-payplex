import React from "react";
import { X, Mail, Phone, Calendar, MapPin, Package } from "lucide-react";
import { format } from "date-fns";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateItemsTotal = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600 text-sm">Order ID: #{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Order Status
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Order Date
                </p>
                <p className="text-gray-900 font-medium">
                  {format(new Date(order.createdAt), "MMM dd, yyyy hh:mm a")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer Information
            </h3>
         <div className="bg-gray-50 rounded-lg p-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    {/* Name */}
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-1">Name</p>
      <p className="text-gray-900">
        {order.userId?.name || "N/A"}
      </p>
    </div>

    {/* Email */}
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
        <Mail size={14} />
        Email
      </div>
      <p className="text-gray-900">
        {order.userId?.email || "N/A"}
      </p>
    </div>

    {/* Contact */}
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
        <Phone size={14} />
        Contact
      </div>
      <p className="text-gray-900">
        +91 {order.userId?.contactNumber || "N/A"}
      </p>
    </div>

  </div>
</div>

          </div>

          {/* Delivery Address */}
          {order.address && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 flex gap-3">
                <MapPin
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-gray-900">{order.address}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.productName || item.productId}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price: </span>
                        <span className="font-semibold text-gray-900">
                          ₹{item.price?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="font-bold text-lg text-gray-900">
                      ₹{(item.price * item.quantity)?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items</span>
                <span className="font-semibold text-gray-900">
                  {calculateItemsTotal(order.items)}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{order.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.paymentMethod && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Payment Method
                </p>
                <p className="text-gray-900 capitalize">
                  {order.paymentMethod}
                </p>
              </div>
            )}
            {order.paymentStatus && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Payment Status
                </p>
                <p className="text-gray-900 capitalize">
                  {order.paymentStatus}
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
