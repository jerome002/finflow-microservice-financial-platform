import axios from 'axios';

/**
 * Normalizes the Gateway URL. 
 * If using Vite's env vars, it uses that; otherwise, it falls back to local.
 */
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000/api';

// Create the unified axios instance
const api = axios.create({ 
  baseURL: GATEWAY_URL,
  // Professional necessity: allows cookies/headers to pass through the gateway
  withCredentials: true 
});

/**
 * Request Interceptor
 * Automatically attaches the JWT from localStorage to every request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (Optional but Recommended)
 * Catch 401 errors globally to redirect users to login if their token expires.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Named exports to maintain compatibility with your existing components
export const authAPI = api; 
export const walletAPI = api;
export default api;