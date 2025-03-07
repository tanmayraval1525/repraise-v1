import axios from 'axios';
import Cookies from "js-cookie";

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL of your Flask backend
  headers: {
    'Content-Type': 'application/json',
  },
});

const api_authorized = axios.create({
  baseURL: "http://localhost:5000", // Change this to your Flask backend URL
  headers: {
      "Content-Type": "application/json",
  },
});

// Automatically add the JWT token from cookies to every request
api_authorized.interceptors.request.use(
  (config) => {
      const token = Cookies.get("access_token");
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => Promise.reject(error)
);


export { api,api_authorized };
