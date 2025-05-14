import axios from 'axios';

const API_URLS = {
  products: process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 'http://localhost:8800/api',
  orders: process.env.NEXT_PUBLIC_ORDERS_API_URL || 'http://localhost:8810/api',
  users: process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:8805/api'
};

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur serveur
      console.error('Erreur API:', error.response.data);
    } else if (error.request) {
      // Erreur réseau
      console.error('Erreur réseau:', error.request);
    } else {
      // Erreur de configuration
      console.error('Erreur:', error.message);
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, API_URLS }; 