import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Public Route Component
 * Checks if user is authenticated and redirects to dashboard
 * If not authenticated, allows access to auth pages (login, register, verify-otp)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector(state => state.auth);

  if (isAuthenticated && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
