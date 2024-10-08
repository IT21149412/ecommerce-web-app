import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/logo.JPG';  // Path to the logo
import './Header.scss';
import { AuthContext } from '../../contexts/AuthContext';  // Import AuthContext for user authentication status
import NotificationDropdown from '../../pages/vendor/NotificationDropdown';
 
const Header = () => {
  const { user, logout } = useContext(AuthContext);  // Access user and logout function from AuthContext
  const navigate = useNavigate();

  // Determine where the "Home" button should redirect
  const handleHomeClick = () => {
    if (user) {
      const role = user.role.toLowerCase();  // Retrieve user role from context
      if (role === 'administrator') {
        navigate('/admin/dashboard');
      } else if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (role === 'csr') {
        navigate('/csr/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();  // Call the logout function
    navigate('/login');  // Redirect to login after logout
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <img src={logo} alt="ClickCart Logo" className="header-logo" />
        <h1 className="header-title">ClickCart</h1>
      </div>
      <nav className="header-right">
        {/* Home button */}
        {user && user.role.toLowerCase() === 'vendor' && (
          <NotificationDropdown />  // Show notification dropdown only for vendors
        )}
        <button className="header-link" onClick={handleHomeClick}>
          {user ? 'Dashboard' : 'Home'}
        </button>

        {/* Show logout button if user is logged in */}
        {user && (
          <button className="header-link logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
