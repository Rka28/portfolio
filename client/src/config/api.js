// ✅ src/config/api.js
export const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : 'https://portfolio-back-jcyp.onrender.com/api';
