import axios from 'axios';

// The only URL the frontend needs to care about
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000/api';

export const authAPI = axios.create({ 
  baseURL: `${GATEWAY_URL}` 
});

export const walletAPI = axios.create({ 
  baseURL: `${GATEWAY_URL}/wallet` 
});

// IMPORTANT: Do not set headers globally at the top of the file.
// If the user logs in, the 'token' variable above won't update.
// Use an interceptor to grab the latest token for every request:

const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authAPI.interceptors.request.use(attachToken);
walletAPI.interceptors.request.use(attachToken);