import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Plus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Only show sidebar for admin users
  if (user?.role !== "admin") {
    return null;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => {
        navigate("/");
        setIsOpen(false);
      },
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      action: () => {
        navigate("/all-products");
        setIsOpen(false);
      },
    },
       {
      id: "productListing",
      label: "Products Listing",
      icon: Package,
      action: () => {
        navigate("/products");
        setIsOpen(false);
      },
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      action: () => {
        navigate("/");
        // Scroll to orders section or emit event to open orders table
        const event = new CustomEvent("openOrdersTable");
        window.dispatchEvent(event);
        setIsOpen(false);
      },
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      action: () => {
        navigate("/");
        // Scroll to users section or emit event to open users table
        const event = new CustomEvent("openUsersTable");
        window.dispatchEvent(event);
        setIsOpen(false);
      },
    },
    {
      id: "add-product",
      label: "Add Product",
      icon: Plus,
      action: () => {
        navigate("/add-product");
        setIsOpen(false);
      },
    },
  ];

  const isActive = (id) => {
    if (id === "dashboard") return location.pathname === "/";
    return location.pathname.includes(id.replace("-", "-"));
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-700 to-blue-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-600">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package size={28} />
            Admin Panel
          </h2>
          <p className="text-blue-200 text-sm mt-1">Manage your store</p>
        </div>

        {/* Menu Items */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-600"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-600 bg-blue-800">
          <div className="text-sm">
            <p className="text-blue-200">Logged in as</p>
            <p className="text-white font-semibold truncate">{user?.name}</p>
            <p className="text-blue-200 text-xs">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Margin (Desktop) */}
      {/* <div className="hidden lg:block" style={{ marginLeft: "16rem" }} /> */}
    </>
  );
};

export default AdminSidebar;
