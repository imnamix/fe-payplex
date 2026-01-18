import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart, Package, CheckCircle, Users, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/common/StatCard";
import FeaturedProducts from "../components/product/FeaturedProducts";
import RecentOrdersTable from "../components/admin/RecentOrdersTable";
import UsersTable from "../components/admin/UsersTable";
import { getDashboardStats, getRecentOrders, getAllUsers } from "../services/dashboardService";
import Spinner from "../components/common/Spinner";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [allUsers, setAllUsers] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
          // Auto-fetch orders for admin
          if (response.data.role === 'admin') {
            try {
              const ordersResponse = await getRecentOrders();
              if (ordersResponse.success) {
                setRecentOrders(ordersResponse.data);
                setShowOrders(true);
              }
            } catch (err) {
              console.error('Error fetching recent orders:', err);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }

    // Listen for sidebar events to open orders/users tables
    const handleOpenOrdersTable = () => {
      if (user?.role === 'admin') {
        fetchRecentOrders();
      }
    };

    const handleOpenUsersTable = () => {
      if (user?.role === 'admin') {
        fetchAllUsers();
      }
    };

    window.addEventListener('openOrdersTable', handleOpenOrdersTable);
    window.addEventListener('openUsersTable', handleOpenUsersTable);

    return () => {
      window.removeEventListener('openOrdersTable', handleOpenOrdersTable);
      window.removeEventListener('openUsersTable', handleOpenUsersTable);
    };
  }, [user]);

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await getRecentOrders();
      if (response.success) {
        setRecentOrders(response.data);
        setShowOrders(true);
        setShowUsers(false);
      }
    } catch (err) {
      console.error('Error fetching recent orders:', err);
      alert('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await getAllUsers();
      if (response.success) {
        setAllUsers(response.data);
        setShowUsers(true);
        setShowOrders(false);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleStatCardClick = (cardType) => {
    // Admin navigation
    if (user?.role === 'admin') {
      if (cardType === 'orders') {
        fetchRecentOrders();
      } else if (cardType === 'users') {
        fetchAllUsers();
      } else if (cardType === 'products') {
        navigate('/all-products');
      }
    }
    
    // User navigation
    if (user?.role === 'user') {
      if (cardType === 'cart') {
        navigate('/cart');
      } else if (cardType === 'orders') {
        navigate('/orders');
      } else if (cardType === 'added-products') {
        navigate('/all-products');
      }
    }
  };

  const handleUserStatusUpdate = (userId, newStatus) => {
    if (allUsers) {
      const updatedUsers = allUsers.map(u =>
        u._id === userId ? { ...u, status: newStatus } : u
      );
      setAllUsers(updatedUsers);
    }
  };

  const handleAddProducts = () => {
    navigate("/add-product");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hello,{" "}
              <span className="text-blue-600">{user?.name || "User"}</span>!
            </h1>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Welcome to Admin Dashboard' : 'Welcome to your dashboard'}
            </p>
          </div>
          {/* {user?.role === 'user' && ( */}
            <button
              onClick={handleAddProducts}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add Products
            </button>
          {/* )} */}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Stats Cards Section */}
        {!loading && stats && (
          <>
            <div className={`grid ${stats.role === 'admin' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'} gap-6 mb-12`}>
              {/* User Role Stats */}
              {stats.role === 'user' && (
                <>
                  <div onClick={() => handleStatCardClick('cart')} className="cursor-pointer">
                    <StatCard
                      title="Cart Products"
                      tagline="Waiting for checkout"
                      count={stats.cartProducts}
                      icon={ShoppingCart}
                      bgColor="bg-blue-50"
                    />
                  </div>

                  <div onClick={() => handleStatCardClick('orders')} className="cursor-pointer">
                    <StatCard
                      title="Ordered Products"
                      tagline="Successfully purchased"
                      count={stats.totalOrders}
                      icon={Package}
                      bgColor="bg-green-50"
                    />
                  </div>

                  <div onClick={() => handleStatCardClick('added-products')} className="cursor-pointer">
                    <StatCard
                      title="Added Products"
                      tagline="Your added items"
                      count={stats.addedProducts}
                      icon={CheckCircle}
                      bgColor="bg-purple-50"
                    />
                  </div>
                </>
              )}

              {/* Admin Role Stats */}
              {stats.role === 'admin' && (
                <>
                  <div onClick={() => handleStatCardClick('orders')} className="cursor-pointer">
                    <StatCard
                      title="Total Orders"
                      tagline="All orders"
                      count={stats.totalOrders}
                      icon={ShoppingCart}
                      bgColor="bg-green-50"
                    />
                  </div>

                  <div onClick={() => handleStatCardClick('users')} className="cursor-pointer">
                    <StatCard
                      title="Total Users"
                      tagline="Active users"
                      count={stats.totalUsers}
                      icon={Users}
                      bgColor="bg-purple-50"
                    />
                  </div>

                  <div onClick={() => handleStatCardClick('products')} className="cursor-pointer">
                    <StatCard
                      title="Total Products"
                      tagline="In the system"
                      count={stats.totalProducts}
                      icon={Package}
                      bgColor="bg-blue-50"
                    />
                  </div>

                  <StatCard
                    title="Total Revenue"
                    tagline="All time revenue"
                    count={`₹${stats.totalRevenue.toFixed(2)}`}
                    icon={TrendingUp}
                    bgColor="bg-orange-50"
                  />
                </>
              )}
            </div>

            {/* Recent Orders Table - Admin only */}
            {stats.role === 'admin' && showOrders && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={() => setShowOrders(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
                <RecentOrdersTable orders={recentOrders} loading={ordersLoading} />
              </div>
            )}

            {/* Users Table - Admin only */}
            {stats.role === 'admin' && showUsers && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
                  <button
                    onClick={() => setShowUsers(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
                <UsersTable
                  users={allUsers}
                  loading={usersLoading}
                  onUserStatusUpdate={handleUserStatusUpdate}
                />
              </div>
            )}

            {/* Products Section - Show for users only */}
            {stats.role === 'user' && (
              <div>
                <FeaturedProducts limit={6} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
