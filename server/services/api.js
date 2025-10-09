// src/services/api.js

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://portfolio-back-jcyp.onrender.com'  // Remplacez par votre URL Render
  : 'http://localhost:8000/api';

// Fonction helper pour les requêtes
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  
  return data;
};

// Newsletter
export const subscribeNewsletter = async (email) => {
  const response = await fetch(`${API_URL}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  return handleResponse(response);
};

export const unsubscribeNewsletter = async (email) => {
  const response = await fetch(`${API_URL}/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  return handleResponse(response);
};

// Contact
export const sendContactMessage = async (name, email, message) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, message })
  });
  
  return handleResponse(response);
};

// Comments
export const addComment = async (projectId, name, email, comment, parentId = null) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, name, email, comment, parentId })
  });
  
  return handleResponse(response);
};

export const getCommentsByProject = async (projectId) => {
  const response = await fetch(`${API_URL}/comments/${projectId}`);
  return handleResponse(response);
};

export const getRepliesByComment = async (commentId) => {
  const response = await fetch(`${API_URL}/comments/replies/${commentId}`);
  return handleResponse(response);
};

// Authentication
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password })
  });
  
  return handleResponse(response);
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  return handleResponse(response);
};

export const getUserComments = async (email) => {
  const response = await fetch(`${API_URL}/user/comments?email=${encodeURIComponent(email)}`);
  return handleResponse(response);
};

// Health check
export const checkApiHealth = async () => {
  const response = await fetch(`${API_URL}/health`);
  return handleResponse(response);
};

export default {
  subscribeNewsletter,
  unsubscribeNewsletter,
  sendContactMessage,
  addComment,
  getCommentsByProject,
  getRepliesByComment,
  registerUser,
  loginUser,
  getUserComments,
  checkApiHealth
};