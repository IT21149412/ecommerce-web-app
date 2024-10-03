import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageVendors from '../pages/admin/ManageVendors';
import OrderManagement from '../pages/admin/OrderManagement';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar/Sidebar'; // Sidebar component

const AdminRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Administrator') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-layout">
      <Sidebar /> {/* Only include the sidebar for admin pages */}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/vendors" element={<ManageVendors />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
