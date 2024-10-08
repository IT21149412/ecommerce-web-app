import React, { useEffect, useState, useContext } from 'react';
import { getUnreadNotifications, markAsRead } from '../../services/NotificationService';  // Corrected path
import { jwtDecode } from 'jwt-decode';
import './NotificationPanel.scss';

const NotificationPanel = ({ onClose }) => {
const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  let vendorId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    vendorId = decodedToken.nameid; 
  }

  useEffect(() => { 
    const fetchNotifications = async () => {
      if (vendorId) {   
        try {
          const data = await getUnreadNotifications(vendorId); 
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  },[]);  

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId)); // Remove from the list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id}>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No unread notifications</p>
      )}
    </div>
  );
};

export default NotificationPanel;
