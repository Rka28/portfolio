// 🌐 Configuration dynamique de l'URL de base de ton API backend
// En local → http://localhost:8000/api
// En production → ton URL Render ou ton sous-domaine OVH
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://portfolio-back-jcyp.onrender.com/api'; // ✅ ton backend Render en production

// 🧠 Fonction générique pour gérer les réponses HTTP
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
};

/* -------------------------------
   📨 NEWSLETTER
--------------------------------- */
export const subscribeNewsletter = async (email) => {
  const response = await fetch(`${API_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

/* -------------------------------
   📬 CONTACT
--------------------------------- */
export const sendContactMessage = async (name, email, message) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  return handleResponse(response);
};

/* -------------------------------
   💬 COMMENTAIRES
--------------------------------- */
export const addComment = async (
  projectId,
  name,
  email,
  comment,
  parentId = null
) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, name, email, comment, parentId }),
  });
  return handleResponse(response);
};

export const getCommentsByProject = async (projectId) => {
  const response = await fetch(`${API_URL}/comments/${projectId}`);
  return handleResponse(response);
};
