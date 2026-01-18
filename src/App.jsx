import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import "./App.css";
import { Toaster } from "react-hot-toast";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

// Main Pages
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/product/ProductList";
import Cart from "./pages/product/Cart";
import Orders from "./pages/product/Orders";
import NotFound from "./pages/NotFound";
import AddProducts from "./pages/product/AddProducts";
import AdminProducts from "./pages/admin/AdminProducts";
import MyProducts from "./pages/product/MyProducts";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth Routes - Public (redirect to dashboard if already logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />

        {/* Main Layout Routes - Protected */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProducts />} />
          <Route path="/all-products" element={<AdminProducts />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
