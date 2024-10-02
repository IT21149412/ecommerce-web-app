import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorDashboard from '../pages/vendor/Dashboard';
import ProductManagement from '../pages/vendor/ProductManagement';
import InventoryManagement from '../pages/vendor/InventoryManagement';
import OrderManagement from '../pages/vendor/OrderManagement';
import { AuthContext } from '../contexts/AuthContext';  // Import the Auth context

const VendorRoutes = () => {
  const { user } = useContext(AuthContext);  // Get the current user from the context

  // Check if the user is authenticated and has the vendor role
  if (!user || user.role !== 'Vendor') {
    return <Navigate to="/login" replace />;  // Redirect to login if not authenticated or not a vendor
  }

  // Render the vendor routes if the user is authenticated as vendor
  return (
    <Routes>
      <Route path="/dashboard" element={<VendorDashboard />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/inventory" element={<InventoryManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
    </Routes>
  );
};

export default VendorRoutes;
