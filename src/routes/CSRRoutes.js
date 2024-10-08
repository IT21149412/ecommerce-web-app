import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CSRDashboard from '../pages/csr/Dashboard';
import OrderManagement from '../pages/csr/OrderStatusManagement';
import CustomerAccountApproval from '../pages/csr/CustomerAccountApproval';
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
        <Routes>
          <Route path="/dashboard" element={<CSRDashboard />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/approvals" element={<CustomerAccountApproval />} />
        </Routes>
    </div>
  );
};

export default CSRRoutes;
