import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, speed: 400 });

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : 'https://ctf.techinfo.uz/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Start progress loader & inject admin token
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Response Interceptor: End progress loader & standardize error format
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    const errorBody = error.response?.data || {
      success: false,
      error: { id: 'SYSTEM_003', message: error.message || 'Network communication error' }
    };
    return Promise.reject(errorBody);
  }
);

export default api;
