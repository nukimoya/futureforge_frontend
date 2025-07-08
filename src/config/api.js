import axios from 'axios';
import { useMemo } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { errorHandler } from '../errorhandler/errorhandler';

export const useAxios = () => {
  const { user } = useAuthContext();

  const token = user?.data?.token;

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://futureforge-back.vercel.app/',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor
    instance.interceptors.request.use(
      (config) => {

        // Skip token injection for auth routes
        if (['/auth/login', '/auth/signup', '/auth/confirm-code', '/auth/resend-code'].includes(config.url)) {
          return config;
        }

        if (!token) {
          throw new Error("No authentication token found");
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          errorHandler(error); // can trigger logout or show toast
          localStorage.removeItem('user');
          setTimeout(() => {
              window.location.href = '/login';
            }, 2000); // 2 seconds (adjust to your toast duration)
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  return api;
};
