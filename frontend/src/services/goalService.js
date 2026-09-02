import api from './api';

/**
 * Goal CRUD operations.
 */

export const getGoals = async (params = {}) => {
  const { data } = await api.get('/goals/', { params });
  return data;
};

export const getGoal = async (goalId) => {
  const { data } = await api.get(`/goals/${goalId}/`);
  return data;
};

export const createGoal = async (payload) => {
  const { data } = await api.post('/goals/', payload);
  return data;
};

export const updateGoal = async (goalId, payload) => {
  const { data } = await api.patch(`/goals/${goalId}/`, payload);
  return data;
};

export const deleteGoal = async (goalId) => {
  const { data } = await api.delete(`/goals/${goalId}/`);
  return data;
};

export default { getGoals, getGoal, createGoal, updateGoal, deleteGoal };
