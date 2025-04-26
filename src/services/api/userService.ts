import { axiosInstance, API_URLS } from './axiosConfig';

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, '_id' | 'createdAt'> {
  confirmPassword: string;
}

export const userService = {
  // Inscription
  register: async (userData: RegisterData) => {
    const response = await axiosInstance.post(`${API_URLS.users}/register`, userData);
    return response.data;
  },

  // Connexion
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post(`${API_URLS.users}/login`, credentials);
    return response.data;
  },

  // Récupérer le profil utilisateur
  getProfile: async (token: string) => {
    const response = await axiosInstance.get(`${API_URLS.users}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (userId: string, userData: Partial<User>, token: string) => {
    const response = await axiosInstance.put(`${API_URLS.users}/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (userId: string, oldPassword: string, newPassword: string, token: string) => {
    const response = await axiosInstance.put(
      `${API_URLS.users}/${userId}/password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}; 