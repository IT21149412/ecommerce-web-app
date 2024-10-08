import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch all orders
export const getAllOrders = async () => {
  const token = localStorage.getItem('token'); // Assuming JWT is used
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/api/order`, config);
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('token'); // Assuming JWT is used
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status }, config);
};
