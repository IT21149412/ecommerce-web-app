import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Import jwt-decode to decode the JWT token

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getUserData = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  return await axios.get(`${API_URL}/api/user`, config);
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/login`, credentials);
    console.log("API Response: ", response.data);

    const token = response.data.token;
    const decodedToken = jwtDecode(token);  // Decode the JWT to get the user's role

    return { token, role: decodedToken.role };  // Return the token and the decoded role
  } catch (error) {
    console.error("Error logging in: ", error.response?.data);
    throw new Error(error.response?.data || 'Login failed');
  }
};
