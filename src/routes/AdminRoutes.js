import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageVendors from '../pages/admin/ManageVendors';
import OrderManagement from '../pages/admin/OrderStatusManagement';
import { AuthContext } from '../contexts/AuthContext';
import ManageProductsAndCategories from '../pages/admin/ManageProductsAndCategories';
import Sidebar from '../components/Sidebar/Sidebar'; // Sidebar component

const AdminRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Administrator') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-layout">
      <Sidebar /> 
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/products" element={<ManageProductsAndCategories />} />
          <Route path="/vendors" element={<ManageVendors />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
    </div>
  );
};

export default AdminRoutes;
