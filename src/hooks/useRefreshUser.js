// src/hooks/useRefreshUser.js
import { useAxios } from '../config/api';
import { useCallback } from 'react';

export const useRefreshUser = (dispatch) => {
  const api = useAxios();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/current-user');

      // ✅ Step 1: Extract token from current localStorage
      const existing = JSON.parse(localStorage.getItem('user'));
      const token = existing?.token;

      // ✅ Step 2: Merge token into updated user data
      const updatedUser = {
        ...res.data, // assuming this is the user object
        token,
      };

      // ✅ Step 3: Save to localStorage and dispatch
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN', payload: updatedUser });

    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  }, [api, dispatch]);

  return refreshUser;
};
