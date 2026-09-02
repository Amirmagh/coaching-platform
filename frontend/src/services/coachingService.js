import api from './api';

/**
 * Coaching session operations (list, create, messages, transcript export).
 */

export const getSessions = async (params = {}) => {
  const { data } = await api.get('/sessions/', { params });
  return data;
};

export const getSession = async (sessionId) => {
  const { data } = await api.get(`/sessions/${sessionId}/`);
  return data;
};

export const createSession = async (payload = {}) => {
  const { data } = await api.post('/sessions/', payload);
  return data;
};

export const updateSession = async (sessionId, payload) => {
  const { data } = await api.patch(`/sessions/${sessionId}/`, payload);
  return data;
};

export const sendMessage = async (sessionId, text) => {
  const { data } = await api.post(`/sessions/${sessionId}/messages/`, { text });
  return data;
};

export const getTranscript = async (sessionId) => {
  const { data } = await api.get(`/sessions/${sessionId}/transcript/`);
  return data;
};

export default {
  getSessions,
  getSession,
  createSession,
  updateSession,
  sendMessage,
  getTranscript,
};
