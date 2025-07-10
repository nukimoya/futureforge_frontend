// src/hooks/useRefreshUser.js
import { useAxios } from './useAxios';
import { useCallback } from 'react';

export const useRefreshUser = (dispatch) => {
  const api = useAxios();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/current-user');
      dispatch({ type: 'LOGIN', payload: res.data });
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  }, [api, dispatch]);

  return refreshUser;
};
