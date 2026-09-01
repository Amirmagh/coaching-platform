import { api } from "./api";
export const getQuestions = phase => api(`/questions/?phase=${phase}`);
