import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import VendorRoutes from './routes/VendorRoutes';
import CSRRoutes from './routes/CSRRoutes';
import Login from './pages/login/Login';
import NotFound from './pages/NotFound';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from './contexts/AuthContext';
import Header from './components/Header/Header';
import './App.scss'; // Main styles for app layout

function App() {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role'); // Retrieve role from localStorage
    if (user?.role) {
      setUserRole(user.role); // If user exists and has a role, set it
      localStorage.setItem('role', user.role); // Sync with localStorage
    } else if (storedRole) {
      setUserRole(storedRole); // If only localStorage has the role, use it
    } else {
      setUserRole(null); // Set to null if no role is found
    }
  }, [user]);

  return (
    <Router>
      <Header />
      {userRole ? (
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={`/${userRole.toLowerCase()}/dashboard`} />} />
            {userRole === 'Administrator' && <Route path="/admin/*" element={<AdminRoutes />} />}
            {userRole === 'Vendor' && <Route path="/vendor/*" element={<VendorRoutes />} />}
            {userRole === 'CSR' && <Route path="/csr/*" element={<CSRRoutes />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
