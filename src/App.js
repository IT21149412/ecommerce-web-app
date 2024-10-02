import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import VendorRoutes from './routes/VendorRoutes';
import CSRRoutes from './routes/CSRRoutes';
import Login from './pages/login/Login';
import NotFound from './pages/NotFound';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for role in context or localStorage and set userRole
    const role = user?.role || localStorage.getItem('role');
    setUserRole(role);
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Redirect to respective dashboard based on the role */}
        <Route
          path="/"
          element={userRole ? <Navigate to={`/${userRole.toLowerCase()}/dashboard`} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        {userRole === 'Administrator' && <Route path="/admin/*" element={<AdminRoutes />} />}
        {userRole === 'Vendor' && <Route path="/vendor/*" element={<VendorRoutes />} />}
        {userRole === 'CSR' && <Route path="/csr/*" element={<CSRRoutes />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
