const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '' // URL relative en production (même domaine)
    : 'http://localhost:8000');

export const API_ENDPOINTS = {
  subscribe: `${API_BASE_URL}/api/subscribe`,
  contact: `${API_BASE_URL}/api/contact`,
  comments: (projectId) => `${API_BASE_URL}/api/comments/${projectId}`,
  addComment: `${API_BASE_URL}/api/comments`,
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`
};

export default API_BASE_URL;