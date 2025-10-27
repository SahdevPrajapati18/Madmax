import axios from 'axios';

// Use environment variable with fallback to production URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';

console.log('🔌 API Backend URL:', BACKEND_URL);

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // Important for CORS
});

// Request interceptor - attach JWT automatically
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token attached to request');
    }
    console.log('📤 API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - log responses and handle errors
API.interceptors.response.use(
  response => {
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      fullError: error
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - clearing token');
      localStorage.removeItem('token');
    }

    if (error.response?.status === 403) {
      console.warn('⚠️ Forbidden - access denied');
    }

    if (error.response?.status === 404) {
      console.warn('⚠️ Not Found - endpoint may not exist');
    }

    if (error.response?.status === 500) {
      console.error('❌ Server Error - backend issue');
    }

    if (!error.response) {
      console.error('❌ Network Error - cannot reach backend:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API;