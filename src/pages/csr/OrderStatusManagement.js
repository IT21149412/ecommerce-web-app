import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/OrderStatusService';
import './OrderStatusManagement.scss';

const OrderStatusManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal order
  const [newStatus, setNewStatus] = useState(''); // Dropdown status

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
      setFilteredOrders(response.data); // Default is to show all orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Handle order status change
  const handleStatusChange = async (orderId) => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh after update
      alert('Order status updated successfully!');
      setSelectedOrder(null); // Close modal
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Open modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus); // Initialize dropdown with current status
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Handle search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customerId.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="order-status-management">
      <h2>Order Status Management</h2>

      <input
        type="text"
        placeholder="Search by Order ID or Customer ID"
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Number of Items</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td> {/* Order Number */}
                <td>{order.customerId || 'N/A'}</td> {/* Customer ID */}
                <td>{order.items ? order.items.length : 0}</td> {/* Number of items */}
                <td>${order.totalOrderPrice ? order.totalOrderPrice.toFixed(2) : '0.00'}</td> {/* Total Price */}
                <td>{order.orderStatus}</td> {/* Order Status */}
                <td>
                  <button className="btn-view-details" onClick={() => openModal(order)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for order details */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>Order Details</h3>
            <p><strong>Order Number:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerId || 'N/A'}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalOrderPrice ? selectedOrder.totalOrderPrice.toFixed(2) : '0.00'}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <p><strong>Items in Order:</strong></p>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Vendor Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName || 'N/A'}</td>
                    <td>{item.vendorName || 'N/A'}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.totalPrice.toFixed(2)}</td>
                    <td style={{ color: item.status === 'Delivered' ? 'green' : 'black' }}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Dropdown to change status */}
            <label htmlFor="order-status">Change Status:</label>
            <select
              id="order-status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div className="modal-actions">
              <button className="btn-update" onClick={() => handleStatusChange(selectedOrder.id)}>
                Update Status
              </button>
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusManagement;
