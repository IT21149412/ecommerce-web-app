import axios from "axios";

const API_URL = "http://localhost:5296/api/Category";

// Fetch all categories
export const getCategories = async () => {
  const token = localStorage.getItem("token");  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios.get(`${API_URL}`, config);
};
