// import { User as NextAuthUser } from 'next-auth';

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'God' | 'superGod';
  googleId?: string;
  picture?: string;
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

export interface RegisterData extends Omit<User, '_id' | 'createdAt' | 'googleId' | 'picture' | 'role' | 'address'> {
  password: string;
  confirmPassword?: string;
}
