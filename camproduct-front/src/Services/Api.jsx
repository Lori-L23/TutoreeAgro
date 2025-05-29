
import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8000",
  // headers: {
  //   "Content-Type": "application/json",
  //   "Accept": "multipart/form-data, application/json",
  //   "X-Requested-With": "XMLHttpRequest"
  // },
  
  withCredentials: true
});

// // Intercepteur pour gérer le CSRF Token
Api.interceptors.request.use(async (config) => {
  // Pour les requêtes mutantes (POST, PUT, DELETE), on s'assure d'avoir le cookie CSRF
  if (['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    
    // Récupère le token depuis les cookies
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
  }

  // Ajoute le token d'authentification si présent
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// // Intercepteur pour gérer les erreurs
Api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Déconnexion automatique si non autorisé
      const authContext = require("./AuthContext").useAuth();
      authContext.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default Api;

