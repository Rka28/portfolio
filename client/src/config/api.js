const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8000';

// ✅ Export nommé pour API_BASE_URL aussi
export const API_URL = API_BASE_URL;

export const API_ENDPOINTS = {
  subscribe: `${API_BASE_URL}/api/subscribe`,
  unsubscribe: `${API_BASE_URL}/api/unsubscribe`,
  contact: `${API_BASE_URL}/api/contact`,
  comments: (projectId) => `${API_BASE_URL}/api/comments/${projectId}`,
  addComment: `${API_BASE_URL}/api/comments`,
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  health: `${API_BASE_URL}/api/health`
};

// ✅ Gardez aussi le default export pour compatibilité
export default API_BASE_URL;