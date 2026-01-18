import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/orderService';
import Spinner from '../../components/common/Spinner';
import { ChevronDown, Package, Calendar, DollarSign } from 'lucide-react';
import '../Dashboard.css';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      setOrders(response.orders || response.data || []);
    } catch (err) {
      const errorMsg =
        typeof err === 'string' ? err : err.message || 'Failed to fetch orders';
      setError(errorMsg);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-1 px-4 sm:px-6 lg:px-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {/* <Package className="text-blue-600" size={32} /> */}
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">
            View and track all your orders
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start shopping to create your first order!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Order Header */}
                <div
                  onClick={() => toggleExpandOrder(order._id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign size={16} />
                          <span className="font-semibold text-gray-900">
                            ${order.total?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-semibold">
                            {order.items?.length || 0}
                          </span>{' '}
                          {order.items?.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="ml-4">
                      <ChevronDown
                        size={24}
                        className={`text-gray-400 transition-transform duration-300 ${
                          expandedOrderId === order._id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrderId === order._id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {/* Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-white rounded border border-gray-200"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${item.subtotal?.toFixed(2) || '0.00'}
                              </p>
                              <p className="text-sm text-gray-600">
                                ${item.price?.toFixed(2) || '0.00'} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax:</span>
                        <span>${order.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                        <span>Total:</span>
                        <span>${order.total?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;