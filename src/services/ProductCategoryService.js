import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ------------------ Category Management ------------------

// Fetch all categories
export const getCategories = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/api/category`, config);
};

// Create a new category
export const createCategory = async (category) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.post(`${API_URL}/api/category/create`, category, config);
};

// Activate a category
export const activateCategory = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/category/${id}/activate`, null, config);
};

// Deactivate a category
export const deactivateCategory = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/category/${id}/deactivate`, null, config);
};



// ------------------ Product Management ------------------

// Fetch all products
export const getProducts = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/api/product`, config);
};

// Activate a product
export const activateProduct = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/product/${id}/activate`, null, config);
};

// Deactivate a product
export const deactivateProduct = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/api/product/${id}/deactivate`, null, config);
};
