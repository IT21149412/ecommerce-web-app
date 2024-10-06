import React, { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../../services/UserService';
import './CustomerAccountApproval.scss';

const CustomerAccountApproval = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data.filter((user) => !['Administrator', 'Vendor', 'CSR'].includes(user.role)));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleActivateUser = async (user) => {
    try {
      const updatedUser = { ...user, isActive: true };
      await updateUser(user._id, updatedUser); // Ensure you are using _id instead of id
      fetchUsers();
      showAlert('Customer account activated successfully!');
    } catch (error) {
      console.error('Error activating customer:', error);
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      const updatedUser = { ...user, isActive: false };
      await updateUser(user._id, updatedUser); // Ensure you are using _id instead of id
      fetchUsers();
      showAlert('Customer account deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating customer:', error);
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="customer-account-approval-container">
      {/* Main Container for the content */}
      <div className="content-container">
        <h2>Customer Account Approval</h2>

        {alertMessage && <div className="alert-message">{alertMessage}</div>}

        {/* Search Input */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>

        {/* Customer List */}
        <h3>Customer List</h3>
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}> {/* Ensure _id is used for the key */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className={user.isActive ? 'active-status' : 'deactivated-status'}>
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </td>
                  <td>
                    {user.isActive ? (
                      <button className="btn-toggle-status deactivate" onClick={() => handleDeactivateUser(user)}>
                        Deactivate
                      </button>
                    ) : (
                      <button className="btn-toggle-status activate" onClick={() => handleActivateUser(user)}>
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountApproval;
