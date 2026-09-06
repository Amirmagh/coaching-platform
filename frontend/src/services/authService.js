import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication service: login, signup, logout and token verification.
 * Wraps the shared axios `api` client and keeps localStorage token
 * handling in one place so components/hooks don't touch storage directly.
 */

const saveTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
  if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
};

const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const login = async (email, password) => {
  const { data } = await api.post('/token/', { email, password });
  saveTokens(data);
  return data;
};

export const signup = async ({ name, email, password }) => {
  const { data } = await api.post('/users/register/', { name, email, password });
  saveTokens(data);
  return data;
};

export const logout = () => {
  clearTokens();
};

// Verifies whether the stored access token is still valid and returns the
// current user profile, or `null` when unauthenticated.
export const verify = async () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!token) return null;
  try {
    const { data } = await api.get('/users/profile/');
    return data;
  } catch {
    clearTokens();
    return null;
  }
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post('/users/password-reset/', { email });
  return data;
};

export default { login, signup, logout, verify, requestPasswordReset };
