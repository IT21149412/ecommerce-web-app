import axios from 'axios';

const API_URL = 'http://localhost:5296/api/Product';

// Fetch all products
export const getProducts = async () => { 
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}`, config);   
};

// Fetch all products by vendor
export const getProductsByVendor = async (vendorId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/vendor/${vendorId}`, config); // Fetch vendor-specific products
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}/${id}`, config);   
};

// Create a new product
export const createProduct = async (product) => {
  const token = localStorage.getItem('token');  
  const config = {
    headers: {
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${token}`,  
    },
  };

  return await axios.post(`${API_URL}/create`, product, config);
};

// Update an existing product
export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',   
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/${id}/update`, productData, config);   
};

// Delete a product
export const deleteProduct = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.delete(`${API_URL}/${id}`, config);   
};

// Activate a product
export const activateProduct = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/${id}/activate`, null, config);   
};

// Deactivate a product
export const deactivateProduct = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.put(`${API_URL}/${id}/deactivate`, null, config);   
};
