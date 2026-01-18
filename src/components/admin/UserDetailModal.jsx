import React from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Package,
  ShieldCheck,
  ShieldX,
  ShoppingCart,
  User as UserIcon,
} from 'lucide-react';
import { format } from 'date-fns';

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile */}
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} /> {user.contactNumber || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Account Status
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`h-3 w-3 rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-semibold capitalize">{user.status}</span>
              </div>
            </div>

            {/* Products */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Products Added
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Package size={18} />
                <span className="font-semibold">
                  {user.addedProductsCount || 0}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Member Since
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={16} />
                {user.createdAt
                  ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                  : 'N/A'}
              </div>
            </div>

            {/* DOB */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Date of Birth
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={16} />
                {user.dob
                  ? format(new Date(user.dob), 'MMM dd, yyyy')
                  : 'N/A'}
              </div>
            </div>

            {/* Role */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">Role</label>
              <div className="flex items-center gap-2 mt-1">
                <UserIcon size={16} />
                <span className="capitalize font-semibold">{user.role}</span>
              </div>
            </div>

            {/* Email Verified */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Email Verification
              </label>
              <div className="flex items-center gap-2 mt-1">
                {user.emailVerified ? (
                  <>
                    <ShieldCheck size={18} className="text-green-600" />
                    <span className="text-green-700 font-semibold">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldX size={18} className="text-red-600" />
                    <span className="text-red-700 font-semibold">
                      Not Verified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          {user.address && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-600">
                Address
              </label>
              <p className="mt-1">{user.address}</p>
            </div>
          )}

          {/* Close */}
          <div className="mt-6 border-t pt-6">
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
