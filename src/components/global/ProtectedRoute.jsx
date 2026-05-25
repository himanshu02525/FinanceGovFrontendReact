import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Restricts access based on user role from localStorage
 * 
 * Usage:
 * <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
 *   <Route path="/admin/dashboard" element={<AdminDashboard />} />
 * </Route>
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and current role is not in the list, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
