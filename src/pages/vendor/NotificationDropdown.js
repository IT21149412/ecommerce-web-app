import React, { useState, useContext } from 'react';
import NotificationPanel from './NotificationPanel';  
import { AuthContext } from '../../contexts/AuthContext';  

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);  
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);   
  };

  return (
    <div className="notification-dropdown">
 
      <button onClick={toggleDropdown} className="notification-bell">
        <i className="fas fa-bell"></i>   
        <span className="notification-count">4</span>  
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-panel-container">
          <NotificationPanel
          onClose={() => setShowNotifications(false)}/>   
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
