import axios from 'axios';

const API_URL = 'http://localhost:5296/api/notification';  // Adjust the base URL according to your API

// Fetch unread notifications for the vendor
export const getUnreadNotifications = async (vendorId) => {
  const response = await axios.get(`${API_URL}/unread/${vendorId}`);
  return response.data;
};

// Mark a notification as read
export const markAsRead = async (notificationId) => {
  await axios.put(`${API_URL}/mark-as-read/${notificationId}`);
};
