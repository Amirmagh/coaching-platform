import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export const auth = {
  register: (data) => client.post("/users/register/", data),
  login: (data) => client.post("/users/token/", data),
  me: () => client.get("/users/me/"),
};

export const coaching = {
  listSessions: () => client.get("/coaching/sessions/"),
  createSession: () => client.post("/coaching/sessions/", {}),
  sendMessage: (sessionId, text) =>
    client.post(`/coaching/sessions/${sessionId}/message/`, { text }),
  listGoals: () => client.get("/coaching/goals/"),
  createGoal: (data) => client.post("/coaching/goals/", data),
};

export default client;
