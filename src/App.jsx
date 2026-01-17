import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
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

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Main Layout Routes - Protected */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
