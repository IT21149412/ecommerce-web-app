import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active state
import { AuthContext } from '../../contexts/AuthContext';
import './Sidebar.scss'; // Sidebar styles

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      {user?.role === 'Administrator' && (
        <>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Admin Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Products and Categories
          </NavLink>
          <NavLink
            to="/admin/vendors"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Vendor Reviews
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Orders
          </NavLink>
        </>
      )}

      {user?.role === 'Vendor' && (
        <>
          <NavLink
            to="/vendor/dashboard"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Vendor Dashboard
          </NavLink>
          <NavLink
            to="/vendor/products"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Products
          </NavLink>
          <NavLink
            to="/vendor/inventory"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Inventory
          </NavLink>
          <NavLink
            to="/vendor/orders"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Orders
          </NavLink>
        </>
      )}

      {user?.role === 'CSR' && (
        <>
          <NavLink
            to="/csr/dashboard"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            CSR Dashboard
          </NavLink>
          <NavLink
            to="/csr/orders"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Manage Orders
          </NavLink>
          <NavLink
            to="/csr/approvals"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            User Approvals
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
