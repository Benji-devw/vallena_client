import { LoginCredentialsTypes, RegisterDataTypes, UserTypes } from '@/types/userTypes';
import { axiosInstance, API_URLS } from './axiosConfig';
// import { User } from 'next-auth';

export const userService = {
  // Register
  register: async (userData: Omit<RegisterDataTypes, 'confirmPassword'>) => {
    const response = await axiosInstance.post(`${API_URLS.users}/register`, userData);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentialsTypes) => {
    const response = await axiosInstance.post(`${API_URLS.users}/login`, credentials);
    return response.data;
  },

  // Get profile
  getProfile: async (token: string) => {
    const response = await axiosInstance.get(`${API_URLS.users}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (userId: string, userData: Partial<UserTypes>, token: string) => {
    const response = await axiosInstance.put(`${API_URLS.users}/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Change password
  changePassword: async (userId: string, oldPassword: string, newPassword: string, token: string) => {
    const response = await axiosInstance.put(
      `${API_URLS.users}/${userId}/password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}; 