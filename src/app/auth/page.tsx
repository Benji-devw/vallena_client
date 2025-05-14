'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userService } from '@/services/api/userService';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  
  // Champs pour la connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Champs pour l'inscription  
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const initialError = searchParams.get('error');

  useEffect(() => {
    if (initialError && !error) {
        setError(
            initialError === 'CredentialsSignin'
            ? 'Email ou mot de passe incorrect'
            : initialError === 'OAuthAccountNotLinked' 
            ? 'Ce compte Google est lié à un autre utilisateur. Essayez de vous connecter avec le compte original.'
            : 'Une erreur est survenue lors de la connexion'
        );
    }
  }, [initialError, error]);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [sessionStatus, router, callbackUrl]);

  const handleCredentialsSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
        callbackUrl,
      });
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Email ou mot de passe incorrect' : 'Une erreur est survenue lors de la connexion');
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Une erreur est survenue pendant la tentative de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('Erreur lors de la connexion avec Google.');
      setLoading(false);
    }
  };

  const handleCredentialsRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    
    if (registerPassword !== registerConfirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const registrationData = {
        email: registerEmail,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
        username: registerUsername,
        avatar: '',
        bio: '',
        role: 'user',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      };
      await userService.register(registrationData);

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: registerEmail,
        password: registerPassword,
        callbackUrl,
      });
      
      if (signInResult?.error) {
        setError(signInResult.error === 'CredentialsSignin' ? 'Email ou mot de passe incorrect' : 'Une erreur est survenue lors de la connexion');
      } else if (signInResult?.ok) {
        router.push(callbackUrl);
      }

    } catch (err: any) {
      console.error("Erreur lors de l'appel à userService.register:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la tentative de création de compte.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === 'loading' || sessionStatus === 'authenticated') {
    return <p>Chargement...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-8 mb-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-b mb-6 w-full">
        <button 
          onClick={() => setActiveTab('login')}
          className={`py-2 px-4 font-medium text-lg focus:outline-none w-full ${
            activeTab === 'login' 
            ? 'border-b-2 border-primary-600 text-primary-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Connexion
        </button>
        <button 
          onClick={() => setActiveTab('register')}
          className={`py-2 px-4 font-medium text-lg focus:outline-none w-full ${
            activeTab === 'register' 
            ? 'border-b-2 border-primary-600 text-primary-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inscription
        </button>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-16 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
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
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou avec votre email</span>
        </div>
      </div>

      {/* Form Login */}
      {activeTab === 'login' && (
        <LoginForm 
          handleCredentialsSignIn={handleCredentialsSignIn}
          error={error}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loading={loading}
        />
      )}

      {/* Form Register */}
      {activeTab === 'register' && (
        <RegisterForm 
          handleCredentialsRegister={handleCredentialsRegister}
          error={error}
          registerEmail={registerEmail}
          setRegisterEmail={setRegisterEmail}
          registerPassword={registerPassword}
          setRegisterPassword={setRegisterPassword}
          registerConfirmPassword={registerConfirmPassword}
          setRegisterConfirmPassword={setRegisterConfirmPassword}
          registerFirstName={registerFirstName}
          setRegisterFirstName={setRegisterFirstName}
          registerLastName={registerLastName}
          setRegisterLastName={setRegisterLastName}
          registerUsername={registerUsername}
          setRegisterUsername={setRegisterUsername}
          loading={loading}
        />
      )}
    </div>
  );
} 