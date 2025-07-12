import axios from "axios";

const API_BASE = "http://localhost:5000/api/questions";

const questionService = {
  getAll: () => axios.get(API_BASE),

  getById: (id) => axios.get(`${API_BASE}/${id}`),

  askQuestion: (data) => axios.post(API_BASE, data),

  postAnswer: (questionId, answerData) =>
    axios.post(`${API_BASE}/${questionId}/answers`, answerData),

  voteAnswer: (questionId, answerId, type) =>
    axios.post(`${API_BASE}/${questionId}/answers/${answerId}/vote`, { type }),

  acceptAnswer: (questionId, answerId) =>
    axios.post(`${API_BASE}/${questionId}/answers/${answerId}/accept`),

  getTags: () => axios.get(`${API_BASE}/tags`),

  getTagStats: () => axios.get(`${API_BASE}/stats/tags`),

  getActivityStats: () => axios.get(`${API_BASE}/stats/activity`),
};

export default questionService;
