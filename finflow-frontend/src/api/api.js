import axios from 'axios';

// The only URL the frontend needs to care about
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000/api';

// Create one main instance
const api = axios.create({ 
  baseURL: GATEWAY_URL 
});

// Interceptor to grab the latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export specific objects to maintain your existing code structure
export const authAPI = api; 
export const walletAPI = api;