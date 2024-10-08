import React, { useState, useEffect } from "react";
import {
  getOrders,
  updateOrderStatusByVendor,
} from "../../services/OrderService";
import "./VendorOrderManagement.scss";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const VendorOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let vendorId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    vendorId = decodedToken.nameid;
  }

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  // Fetch orders
  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders(); // Fetch all orders
      const allOrders = response.data;

      // Filter out orders where vendor doesn't have any items, but still keep orders with mixed vendor items
      const vendorOrders = allOrders
        .map((order) => {
          // Filter the order items to only show items belonging to the logged-in vendor
          const vendorItems = order.items.filter(
            (item) => item.vendorId === vendorId
          );

          // If the vendor has items in this order, return the filtered order with only vendor's items
          if (vendorItems.length > 0) {
            return { ...order, vendorItems }; // Add the vendorItems as a new field
          }

          return null; // Return null if no items belong to this vendor
        })
        .filter((order) => order !== null); // Remove any orders that don't have items from this vendor

      setOrders(vendorOrders); // Set the filtered orders
      setLoading(false);
    } catch (error) {
      setError("Error fetching orders");
      setLoading(false);
    }
  };
  // Update order status
  const handleOrderStatus = async (orderId) => {
    try {
      // Use the 'partially-delivered' endpoint and pass the vendorId
      await updateOrderStatusByVendor(orderId, vendorId); // Call the service function with orderId and vendorId
      fetchVendorOrders(); // Refetch orders to get the latest status
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleCopy = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (error) {
      console.error("Failed to copy order ID", error);
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
            <th>Vendor Items</th> {/* New Column */}
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
                {copiedOrderId === order.id && (
                  <span className="copied-feedback">Copied!</span>
                )}
              </td>
              <td>{order.customerId}</td> {/* Assuming we have customerName */}
              <td>
                {" "}
                {order.vendorItems.map((item) => (
                  <div key={item.id}>{item.status}</div>
                ))}
              </td>
              <td>
                {/* Display the items belonging to the logged-in vendor with name and quantity */}
                {order.vendorItems.map((item) => (
                  <div key={item.id}>{item.productName}</div>
                ))}
              </td>
              <td>
                <button
                  className="btn-deliver"
                  onClick={() => handleOrderStatus(order.id)}
                  disabled={order.status === "Delivered"}
                >
                  Mark as Delivered
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
