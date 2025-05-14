// import { User as NextAuthUser } from 'next-auth';

export interface UserTypes {
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

export interface LoginCredentialsTypes {
  email: string;
  password: string;
}

export interface RegisterDataTypes extends Omit<UserTypes, '_id' | 'createdAt' | 'googleId' | 'picture' | 'role' | 'address'> {
  password: string;
  confirmPassword?: string;
}
