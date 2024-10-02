import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CSRDashboard from '../pages/csr/Dashboard';
import OrderManagement from '../pages/csr/OrderManagement';
import UserApproval from '../pages/csr/UserApproval';
import { AuthContext } from '../contexts/AuthContext';  // Import the Auth context

const CSRRoutes = () => {
  const { user } = useContext(AuthContext);  // Get the current user from the context

  // Check if the user is authenticated and has the CSR role
  if (!user || user.role !== 'CSR') {
    return <Navigate to="/login" replace />;  // Redirect to login if not authenticated or not a CSR
  }

  // Render the CSR routes if the user is authenticated as CSR
  return (
    <Routes>
      <Route path="/dashboard" element={<CSRDashboard />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/approvals" element={<UserApproval />} />
    </Routes>
  );
};

export default CSRRoutes;
