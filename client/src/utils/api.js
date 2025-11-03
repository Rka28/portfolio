export const getApiUrl = () => {
	return window.location.hostname === 'localhost' 
	  ? 'http://localhost:8000' 
	  : '';
  };