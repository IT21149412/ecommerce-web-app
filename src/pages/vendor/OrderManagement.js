import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../services/OrderService';
import './VendorOrderManagement.scss';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const VendorOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let vendorId = null;
  

  if (token) {
    const decodedToken = jwtDecode(token);
    vendorId = decodedToken.nameid; 
  }

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  // Fetch orders relevant to the vendor
  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders(vendorId); // Pass vendorId to getOrders function
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  // Update order status
  const handleOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, vendorId); // Pass vendorId to updateOrderStatus function
      fetchVendorOrders(); // Refetch orders to get the latest status
    } catch (error) {
      console.error('Error updating order status', error);
    }
  };

  const handleCopy = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000); // Clear after 2 seconds
    } catch (error) {
      console.error('Failed to copy order ID', error);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const viewOrderDetails = (id) => {
    navigate(`/vendor/Order/${id}`);
  };
  

  
  return (
    <div className="vendor-order-management">
      <h1>Vendor Order Management</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                {order.id} 
                <button 
                  className="icon-button" 
                  onClick={() => handleCopy(order.id)}
                  title="Copy Order ID"
                >
                  <i className="fa fa-copy"></i>
                </button>
                {copiedOrderId === order.id && <span className="copied-feedback">Copied!</span>}
              </td>
              <td>{order.customerName}</td> {/* Assuming we have customerName */}
              <td>{order.status}</td>
              <td>
                <button
                  className="btn-deliver"
                  onClick={() => handleOrderStatus(order.id, 'Delivered')}
                  disabled={order.status === 'Delivered'}
                >
                  Mark as Delivered
                </button>
                <button
                  className="btn-ready"
                  onClick={() => handleOrderStatus(order.id, 'Ready for Delivery')}
                  disabled={order.status === 'Ready for Delivery'}
                >
                  Ready for Delivery
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => handleOrderStatus(order.id, 'Cancelled')}
                  disabled={order.status === 'Cancelled'}
                >
                  Cancel Order
                </button>
              </td>
              <td>
              <button
                  className="icon-button"
                  onClick={() => viewOrderDetails(order.id)}
                >
                  <i className="fa fa-eye"></i>
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorOrderManagement;
