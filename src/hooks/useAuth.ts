import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService, User, LoginCredentials, RegisterData } from '@/services/api/userService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userService.getProfile(token)
        .then(userData => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await userService.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      setError('Identifiants invalides');
      throw err;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      const response = await userService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');
      
      const updatedUser = await userService.updateProfile(user._id, userData, token);
      setUser(updatedUser);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
}; 