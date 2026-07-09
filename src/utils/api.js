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

// Response Interceptor: End progress loader & handle token refresh on 401
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    NProgress.done();
    const originalRequest = error.config;

    // Check if error is unauthorized and request wasn't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('adminRefreshToken');

      if (refreshToken) {
        try {
          // Attempt to rotate tokens by calling the backend /auth/refresh endpoint
          const baseURL = import.meta.env.DEV ? '/api/v1' : 'https://ctf.techinfo.uz/api/v1';
          const res = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken
          });

          if (res.data?.success) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem('adminToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('adminRefreshToken', newRefreshToken);
            }
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Purge session and logout
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
          window.dispatchEvent(new Event('admin-logout'));
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.dispatchEvent(new Event('admin-logout'));
      }
    }

    const errorBody = error.response?.data || {
      success: false,
      error: { id: 'SYSTEM_003', message: error.message || 'Network communication error' }
    };
    return Promise.reject(errorBody);
  }
);

export default api;
