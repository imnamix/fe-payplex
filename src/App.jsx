import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

// Main Pages
import Dashboard from './pages/Dashboard';
import ProductList from './pages/product/ProductList';
import Cart from './pages/product/Cart';
import Orders from './pages/product/Orders';

const App = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyOtp />} />

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default App;
