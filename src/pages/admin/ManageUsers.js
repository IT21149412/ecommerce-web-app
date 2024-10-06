import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/UserService';
import './ManageUsers.scss';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('webUsers');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'CSR',
    password: ''
  });
  const [editUser, setEditUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      fetchUsers();
      showAlert('User added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      await updateUser(user.id, user);
      fetchUsers();
      showAlert('User updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await deleteUser(id);
        fetchUsers();
        showAlert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleActivateUser = async (user) => {
    try {
      const updatedUser = { ...user, isActive: true };
      await updateUser(user.id, updatedUser);
      fetchUsers();
      showAlert('User activated successfully!');
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      const updatedUser = { ...user, isActive: false };
      await updateUser(user.id, updatedUser);
      fetchUsers();
      showAlert('User deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  // Toggle between Web Users and Mobile Users
  const handleToggle = (tab) => {
    setActiveTab(tab);
  };

  const startEditUser = (user) => {
    setEditUser(user);
    setIsEditing(true);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'CSR', password: '' });
    setEditUser(null);
    setIsEditing(false);
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

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    const filtered = users.filter((user) => user.role.toLowerCase() === role.toLowerCase());
    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setRoleFilter('');
    setFilteredUsers(users);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredByRole = activeTab === 'webUsers'
    ? filteredUsers.filter((user) => ['Administrator', 'Vendor', 'CSR'].includes(user.role))
    : filteredUsers.filter((user) => !['Administrator', 'Vendor', 'CSR'].includes(user.role));

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>

      {alertMessage && <div className="alert-message">{alertMessage}</div>}

      {/* Toggle Buttons for Web Users and Mobile Customers */}
      <div className="tab-toggle-container">
        <div
          className={`tab-toggle ${activeTab === 'webUsers' ? 'active-tab-toggle' : ''}`}
          onClick={() => handleToggle('webUsers')}
        >
          Web Users
        </div>
        <div
          className={`tab-toggle ${activeTab === 'mobileUsers' ? 'active-tab-toggle' : ''}`}
          onClick={() => handleToggle('mobileUsers')}
        >
          Mobile Customers
        </div>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        {activeTab === 'webUsers' && (
          <div className="filter-buttons">
            <button
              onClick={() => handleRoleFilter('Administrator')}
              className={`btn-filter ${roleFilter === 'Administrator' && 'active-filter'}`}
            >
              Admins
            </button>
            <button
              onClick={() => handleRoleFilter('CSR')}
              className={`btn-filter ${roleFilter === 'CSR' && 'active-filter'}`}
            >
              CSRs
            </button>
            <button
              onClick={() => handleRoleFilter('Vendor')}
              className={`btn-filter ${roleFilter === 'Vendor' && 'active-filter'}`}
            >
              Vendors
            </button>
            <button onClick={clearFilters} className="btn-filter">Clear Filters</button>
          </div>
        )}
      </div>

      {activeTab === 'webUsers' && (
        <button className="btn-primary open-modal-button" onClick={openModal}>Create New User</button>
      )}

      <h3>User List</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {activeTab === 'webUsers' && <th>Role</th>}
            {activeTab === 'mobileUsers' && <th>Date Created</th>}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredByRole.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {activeTab === 'webUsers' && <td>{user.role}</td>}
              {activeTab === 'mobileUsers' && <td>{formatDate(user.createdAt)}</td>}
              <td className={user.isActive ? 'active-status' : 'deactivated-status'}>
                {user.isActive ? 'Active' : 'Deactivated'}
              </td>
              <td>
                {activeTab === 'webUsers' ? (
                  <>
                    <button className="icon-button" onClick={() => startEditUser(user)}>
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteUser(user.id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </>
                ) : null}
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

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h3>{isEditing ? 'Edit User' : 'Create New User'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEditing) {
                  handleUpdateUser(editUser);
                } else {
                  handleCreateUser(e);
                }
              }}
            >
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editUser.name : newUser.name}
                  onChange={(e) =>
                    isEditing
                      ? setEditUser({ ...editUser, name: e.target.value })
                      : handleInputChange(e)
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing ? editUser.email : newUser.email}
                  onChange={(e) =>
                    isEditing
                      ? setEditUser({ ...editUser, email: e.target.value })
                      : handleInputChange(e)
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={isEditing ? editUser.role : newUser.role}
                  onChange={(e) =>
                    isEditing
                      ? setEditUser({ ...editUser, role: e.target.value })
                      : handleInputChange(e)
                  }
                  className="form-control"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Vendor">Vendor</option>
                  <option value="CSR">CSR</option>
                </select>
              </div>
              {!isEditing && (
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>
              )}
              <button type="submit" className="btn-primary">{isEditing ? 'Update User' : 'Create User'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
