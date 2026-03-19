import axios from 'axios';

/**
 * Normalizes the Gateway URL. 
 */
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000/api';

// Create the unified axios instance
const api = axios.create({ 
  baseURL: GATEWAY_URL,
  withCredentials: true,
  // FIX: Increased timeout to 60s to handle Render "Cold Starts"
  timeout: 60000 
});

/**
 * Wake-up Utility (Cold Start Fix)
 * Call this in your App.jsx useEffect to trigger the Render "Spin up" process early.
 */
export const pokeServer = async () => {
  try {
    // Just a simple GET to any public route (like a health check)
    await api.get('/auth/health'); 
    console.log("Server is awake and ready.");
  } catch (err) {
    // We expect a 404 or 200; we just need to hit the server to wake it
    console.log("Server pinged.");
  }
};

/**
 * Request Interceptor
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
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Timeouts specifically for better UX
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out. Server is taking too long to wake up.");
    }
    
    if (error.response?.status === 401) {
      // Optional: localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Named exports
export const authAPI = api; 
export const walletAPI = api;
export default api;