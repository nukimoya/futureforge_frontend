// src/hooks/useRefreshUser.js
import { useAxios } from '../config/api';
import { useCallback } from 'react';

export const useRefreshUser = (dispatch) => {
  const api = useAxios();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/current-user');

      // ✅ Save the returned data as-is (already has user + token structure)
      localStorage.setItem('user', JSON.stringify(res.data));
      dispatch({ type: 'LOGIN', payload: res.data });

    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  }, [api, dispatch]);

  return refreshUser;
};
