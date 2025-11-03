// Fonction simple qui retourne l'URL de base
export const getApiUrl = () => {
	// En production sur Render, les URLs relatives fonctionnent
	// En dev, utilise localhost
	return window.location.hostname === 'localhost' 
	  ? 'http://localhost:8000' 
	  : '';
  };