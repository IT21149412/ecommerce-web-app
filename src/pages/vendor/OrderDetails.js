import React, { useState, useEffect } from 'react';
import { getOrderById } from '../../services/OrderService'; // Assuming a service to fetch order by ID
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './OrderDetails.scss';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [vendorItems, setVendorItems] = useState([]);

  // Get the vendor ID from the JWT token
  const token = localStorage.getItem('token');
  let vendorId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    vendorId = decodedToken.nameid;  
  }

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderById(id); // Fetch order details by ID
      const orderData = response.data;

      // Filter the items that belong to the logged-in vendor
      const relevantItems = orderData.items.filter(item => item.vendorId === vendorId);
      
      setOrder(orderData);
      setVendorItems(relevantItems); // Set the vendor-specific items
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      
      <div className="details-content">
        {/* Left Section - Order Basic Information */}
        <div className="left-section">
          <div className="order-info">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer ID:</strong> {order.customerId}</p>
            <p><strong>Order Status:</strong> {order.status}</p>
            <p><strong>Order Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Partially Delivered:</strong> {order.isPartiallyDelivered ? 'Yes' : 'No'}</p>
            <p><strong>Note:</strong> {order.note || 'No note provided.'}</p>
          </div>
        </div>

        {/* Right Section - Items in the Order */}
        <div className="right-section">
          <h3>Items for You in this Order</h3>
          {vendorItems.length > 0 ? (
            <div className="order-items">
              {vendorItems.map((item, index) => (
                <div key={index} className="order-item">
                  <p><strong>Product Name:</strong> {item.name}</p> {/* Assuming item.name exists */}
                  <p><strong>Product ID:</strong> {item.productId}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                  <p><strong>Total Price:</strong> ${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No items found for this vendor in this order.</p>
          )}
        </div>
      </div>

      {/* Vendor Status Section */}
      <div className="vendor-status-section">
        <h3>Your Delivery Status</h3>
        {order.vendorStatuses.length > 0 ? (
          <div className="vendor-status-list">
            {order.vendorStatuses
              .filter(vendorStatus => vendorStatus.vendorId === vendorId) // Filter to show only the logged-in vendor's status
              .map((vendorStatus, index) => (
                <div key={index} className="vendor-status">
                  <p><strong>Vendor ID:</strong> {vendorStatus.vendorId}</p>
                  <p><strong>Is Delivered:</strong> {vendorStatus.isDelivered ? 'Yes' : 'No'}</p>
                </div>
              ))}
          </div>
        ) : (
          <p>No vendor statuses available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
