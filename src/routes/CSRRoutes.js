import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CSRDashboard from '../pages/csr/Dashboard';
import OrderManagement from '../pages/csr/OrderManagement';
import UserApproval from '../pages/csr/UserApproval';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar/Sidebar'; // Sidebar component

const CSRRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'CSR') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-layout">
      <Sidebar /> {/* Only include the sidebar for CSR pages */}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<CSRDashboard />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/approvals" element={<UserApproval />} />
        </Routes>
      </div>
    </div>
  );
};

export default CSRRoutes;
