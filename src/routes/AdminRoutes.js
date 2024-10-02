import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageVendors from '../pages/admin/ManageVendors';
import OrderManagement from '../pages/admin/OrderManagement';
import { AuthContext } from '../contexts/AuthContext';  // Import the Auth context

const AdminRoutes = () => {
  const { user } = useContext(AuthContext);  // Get the current user from the context

  // Check if the user is authenticated and has the admin role
  if (!user || user.role !== 'Administrator') {
    return <Navigate to="/login" replace />;  // Redirect to login if not authenticated or not an admin
  }

  // Render the admin routes if the user is authenticated as an admin
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/users" element={<ManageUsers />} />
      <Route path="/vendors" element={<ManageVendors />} />
      <Route path="/orders" element={<OrderManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
