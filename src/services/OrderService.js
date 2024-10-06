import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Order';

// Fetch all orders for the vendor (pass vendorId)
export const getOrders = async (vendorId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/vendor/${vendorId}`, config); // Fetch vendor-specific orders
};

// Fetch order details by ID
export const getOrderById = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`http://localhost:5296/api/Order/${id}`, config);
};

// Update order status (e.g., Delivered, Ready for Delivery, Cancelled)
export const updateOrderStatus = async (orderId, status, vendorId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  let statusApi = '';
  if (status === 'Delivered') {
    statusApi = `/deliver`;
  } else if (status === 'Ready for Delivery') {
    statusApi = `/partially-delivered/${vendorId}`; // Pass vendorId here
  } else if (status === 'Cancelled') {
    statusApi = `/cancel`;
  }

  return await axios.put(`${API_URL}/${orderId}${statusApi}`, null, config);
};
