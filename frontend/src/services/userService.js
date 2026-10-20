import api from './api';

/**
 * User profile & account settings operations.
 */

export const getProfile = async () => {
  const { data } = await api.get('/users/profile/');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch('/users/profile/', payload);
  return data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await api.post('/users/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

export const updateSettings = async (settings) => {
  const { data } = await api.patch('/users/settings/', settings);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/users/profile/');
  return data;
};

export default { getProfile, updateProfile, changePassword, updateSettings, deleteAccount };
