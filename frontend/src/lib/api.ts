import axios from 'axios';

// Shared axios instance — automatically attaches the JWT token from localStorage
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taxai-token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// If the token is expired/invalid, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('taxai-token');
      localStorage.removeItem('taxai-user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
