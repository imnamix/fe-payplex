import React, { useState } from 'react';
import { updateUserStatus } from '../../services/dashboardService';
import { ChevronDown } from 'lucide-react';
import UserDetailModal from './UserDetailModal';

const UsersTable = ({ users, loading, onUserStatusUpdate }) => {
    console.log('users:', users);
  const [updating, setUpdating] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdating(userId);
      await updateUserStatus(userId, newStatus);
      if (onUserStatusUpdate) {
        onUserStatusUpdate(userId, newStatus);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No users found</p>
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
                Profile
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Contact Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Products Added
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.contactNumber}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {user.addedProductsCount || 0}
                  </span>
                </td>
               
<td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
  <div className="relative inline-flex items-center">
    <select
      value={user.status}
      onChange={(e) =>
        handleStatusChange(user._id, e.target.value)
      }
      disabled={updating === user._id}
      className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-semibold cursor-pointer capitalize 
        ${getStatusColor(user.status)} 
        border-0 outline-none
        ${updating === user._id ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    {/* Lucide dropdown icon */}
    <ChevronDown
      size={14}
      className="absolute right-2 pointer-events-none text-current"
    />
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UsersTable;
