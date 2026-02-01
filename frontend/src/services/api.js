import axios from 'axios';

const API_URL = 'https://college-connect-4.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllStudents: () => api.get('/users/students'),
  getStudentById: (id) => api.get(`/users/students/${id}`)
};

export const messageAPI = {
  sendMessage: (data) => api.post('/messages/send', data),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  getConversations: () => api.get('/messages/conversations')
};
