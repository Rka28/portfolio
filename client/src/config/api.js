// Configuration de l'URL de base
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return ''; // URL relative en production
  }
  return 'http://localhost:8000';
};

const BASE_URL = getBaseURL();

// Création des endpoints
const API_ENDPOINTS = {
  subscribe: `${BASE_URL}/api/subscribe`,
  unsubscribe: `${BASE_URL}/api/unsubscribe`,
  contact: `${BASE_URL}/api/contact`,
  comments: (projectId) => `${BASE_URL}/api/comments/${projectId}`,
  addComment: `${BASE_URL}/api/comments`,
  login: `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  health: `${BASE_URL}/api/health`
};

// Export nommé
export { API_ENDPOINTS };

// Export par défaut
export default BASE_URL;