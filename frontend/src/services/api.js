import axios from 'axios';

// Environment variables with fallbacks
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://madmax-production.up.railway.app';
const MUSIC_API_URL = import.meta.env.VITE_MUSIC_API || 'https://madmax-production.up.railway.app';
const NOTIFY_API_URL = import.meta.env.VITE_NOTIFY_API || 'https://madmax-production.up.railway.app';

console.log('🔌 API Configuration:', {
  BACKEND_URL,
  MUSIC_API_URL,
  NOTIFY_API_URL
});

// Create axios instances for different services
const authAPI = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

const musicAPI = axios.create({
  baseURL: `${MUSIC_API_URL}/api`,
  withCredentials: true,
});

const notifyAPI = axios.create({
  baseURL: `${NOTIFY_API_URL}/api`,
  withCredentials: true,
});

// Main API instance that routes to appropriate service
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`, // Default fallback
  withCredentials: true,
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
      method: config.method?.toUpperCase(),
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

// Route requests to appropriate API based on endpoint
API.interceptors.request.use(config => {
  // Route auth endpoints to authAPI
  if (config.url?.startsWith('/auth/') || config.url?.includes('/auth')) {
    config.baseURL = `${BACKEND_URL}/api`;
    console.log('🔄 Routing to Auth API:', config.url);
  }
  // Route music endpoints to musicAPI
  else if (config.url?.startsWith('/music/') || config.url?.includes('/music')) {
    config.baseURL = `${MUSIC_API_URL}/api`;
    console.log('🔄 Routing to Music API:', config.url);
  }
  // Route notification endpoints to notifyAPI
  else if (config.url?.startsWith('/notification/') || config.url?.includes('/notification')) {
    config.baseURL = `${NOTIFY_API_URL}/api`;
    console.log('🔄 Routing to Notify API:', config.url);
  }
  else {
    // Default to backend URL for other endpoints
    config.baseURL = `${BACKEND_URL}/api`;
    console.log('🔄 Routing to Default API:', config.url);
  }

  return config;
});

// Export individual API instances for direct use if needed
export { authAPI, musicAPI, notifyAPI };
export default API;