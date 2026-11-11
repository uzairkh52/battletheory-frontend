import axios from 'axios';

// Dynamic Base URL Normalizer (Ensures /api is always present)
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    const trimmedUrl = envUrl.replace(/\/+$/, '');
    return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
  }
  // Hardcoded localhost ki jagah AWS EC2 IP fallback set kar diya:
  return 'http://75.101.209.235:5000/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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