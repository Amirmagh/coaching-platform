import api from './api';

/**
 * Admin service: wraps the backend `/admin/` endpoints for managing users,
 * sessions, payments and analytics. All calls require an admin/moderator JWT.
 */

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users/', { params });
  return data;
};

export const getUser = async (userId) => {
  const { data } = await api.get(`/admin/users/${userId}/`);
  return data;
};

export const updateUser = async (userId, payload) => {
  const { data } = await api.patch(`/admin/users/${userId}/`, payload);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}/`);
  return data;
};

export const getSessions = async (params = {}) => {
  const { data } = await api.get('/admin/sessions/', { params });
  return data;
};

export const getPayments = async (params = {}) => {
  const { data } = await api.get('/admin/payments/', { params });
  return data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/admin/analytics/');
  return data;
};

export default {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getSessions,
  getPayments,
  getAnalytics,
};
