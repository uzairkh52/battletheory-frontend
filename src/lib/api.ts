import axios from 'axios';

// Dynamic Base URL Normalizer (Ensures /api is always present)
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    const trimmedUrl = envUrl.replace(/\/+$/, '');
    return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
  }
  // Yahan AWS IP ki jagah apni domain wali API URL set kar di hai:
  return 'https://api.battletheory.net/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Pass auth token automatically for request headers
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;