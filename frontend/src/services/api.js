import axios from 'axios';

// Use environment variable with fallback to production URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // Important for CORS
});

// Attach JWT automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
