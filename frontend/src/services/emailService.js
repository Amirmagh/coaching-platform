import api from './api';

/**
 * Email verification & password reset service. Maps to the backend
 * `/auth/` endpoints (send verification, verify token, password reset).
 */

export const sendVerificationEmail = async () => {
  const { data } = await api.post('/auth/send-verification/');
  return data;
};

export const verifyEmailToken = async (token) => {
  const { data } = await api.post(`/auth/verify-email/${token}/`);
  return data;
};

export const sendPasswordReset = async (email) => {
  const { data } = await api.post('/auth/send-reset-password/', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}/`, { password });
  return data;
};

export default { sendVerificationEmail, verifyEmailToken, sendPasswordReset, resetPassword };
