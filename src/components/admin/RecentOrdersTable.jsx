import React, { useState } from 'react';
import { format } from 'date-fns';
import OrderDetailModal from './OrderDetailModal';

const RecentOrdersTable = ({ orders, loading }) => {
    console.log('orders:', orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateItemsAmount = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Items
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  #{order.orderId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.userId?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {calculateItemsAmount(order.items)} item{calculateItemsAmount(order.items) !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default RecentOrdersTable;
