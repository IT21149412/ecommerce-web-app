import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorDashboard from '../pages/vendor/Dashboard';
import ProductManagement from '../pages/vendor/ProductManagement';
import InventoryManagement from '../pages/vendor/InventoryManagement';
import OrderManagement from '../pages/vendor/OrderManagement';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar/Sidebar';  
import ProductDetails from '../pages/vendor/ProductDetails';
import OrderDetails from '../pages/vendor/OrderDetails';
import NotificationPanel from '../pages/vendor/NotificationPanel';

const VendorRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Vendor') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main-layout">
      <Sidebar /> {/* Only include the sidebar for vendor pages */}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/Order/:id" element={<OrderDetails />} />
          <Route path="/notifications" element={<NotificationPanel />} /> {/* No need for vendorId */}

          </Routes>
      </div>
    </div>
  );
};

export default VendorRoutes;
