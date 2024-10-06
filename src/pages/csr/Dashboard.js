import React, { useContext } from 'react';
import './Dashboard.scss';
import { AuthContext } from '../../contexts/AuthContext';  // Import AuthContext
import logo from '../../assets/logos/logo.JPG'; 
import order from '../../assets/images/order.avif';
import product from '../../assets/images/product.avif';
import profile from '../../assets/images/profile.png';

const Dashboard = () => {
  const { user } = useContext(AuthContext);  // Retrieve user data from context
  const userName = user ? user.role : 'User';  // Fallback if user is null

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={logo} alt="ClickCart Logo" className="clickcart-logo" />
        <h1>Welcome back, {userName}!!</h1>
      </div>

      <div className="dashboard-content">
        <h2>Your Dashboard</h2>
        <div className="dashboard-widgets">
          <div className="widget orders-widget">
            <h3>Orders Overview</h3>
            <p>Check and manage all your recent orders</p>
            <img src={order} alt="Orders Overview" className="widget-img" />
          </div>

          <div className="widget analytics-widget">
            <h3>Product Analytics</h3>
            <p>Track the performance of your products</p>
            <img src={product} alt="Product Analytics" className="widget-img" />
          </div>

          <div className="widget account-widget">
            <h3>Account Settings</h3>
            <p>Update your profile, password, and preferences</p>
            <img src={profile} alt="Account Settings" className="widget-img" />
          </div>
        </div>

        <div className="extra-dashboard-section">
          <h3>Latest Updates</h3>
          <p>Stay informed with the latest news and updates from ClickCart.</p>
          <img src="https://via.placeholder.com/600x300" alt="Latest Updates" className="updates-img" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
