import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch all users
export const getUsers = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/api/user`, config);
};

// Create a new user
export const createUser = async (user) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Send the plain password field as "password" (not "passwordHash")
  const userPayload = {
    ...user,
    password: user.password  // Send the plain password as "password"
  };

  return await axios.post(`${API_URL}/api/user/register`, userPayload, config);
};





// Update an existing user
export const updateUser = async (id, user) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/user/${id}/update`, user, config);
};

// Delete a user
export const deleteUser = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`${API_URL}/api/user/${id}`, config);
};

// Activate a user
export const activateUser = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/user/${id}/activate`, null, config);
};

// Deactivate a user
export const deactivateUser = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/user/${id}/deactivate`, null, config);
};
