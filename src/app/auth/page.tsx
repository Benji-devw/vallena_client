'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  // const handleCredentialsSignIn = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);
  //   try {
  //     const result = await signIn('credentials', {
  //       email,
  //       password,
  //       redirect: false,
  //       callbackUrl,
  //     });
  //     if (result?.error) {
  //       setError(result.error === 'CredentialsSignin' ? 'Email ou mot de passe incorrect' : 'Une erreur est survenue lors de la connexion');
  //     } else if (result?.ok) {
  //       router.push(callbackUrl);
  //       router.refresh();
  //     }
  //   } catch (err) {
  //     setError('Une erreur est survenue');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleSignIn = async () => {
  //   signIn('google');
  //   // setError('');
  //   // setLoading(true);
  //   // try {
  //   //   await signIn('google');
  //   // } catch (err) {
  //   //   setError('Erreur lors de la connexion avec Google');
  //   // } finally {
  //   //   setLoading(false);
  //   // }
  // };

  // if (session) {
  //   router.push(callbackUrl);
  //   return null;
  // }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      
      <div className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn('google')}
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Continuer avec Google
        </button>
      </div>

      <div className="mt-4 text-center">
        <a href="/register" className="text-sm text-pink-600 hover:text-pink-700">
          Pas encore de compte ? S'inscrire
        </a>
      </div>
    </div>
  );
} 