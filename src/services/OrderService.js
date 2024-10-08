//service

import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Order';

// Fetch all orders (possibly filtered by vendorId, depending on your API needs)
export const getOrders = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Adjust this based on the new API requirements
  return await axios.get(API_URL, config);  // Use the new GET /api/Order endpoint
};

// Fetch order details by ID
export const getOrderById = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/${id}`, config);  // This should remain the same
};

// Update order status (e.g., Delivered, Ready for Delivery, Cancelled, or Partially Delivered)

// Update order status (e.g., Delivered, Partially Delivered)
export const updateOrderStatusByVendor = async (orderId, vendorId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Call the 'partially-delivered' endpoint
  return await axios.put(`${API_URL}/${orderId}/partially-delivered/${vendorId}`, null, config);
};