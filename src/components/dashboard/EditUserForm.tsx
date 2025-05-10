'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'next-auth'; // Importer le type User de next-auth
import { useSession } from 'next-auth/react';

interface EditUserFormProps {
  // @ts-ignore // TODO: Définir un type plus précis pour user si nécessaire
  user: User | undefined;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {
  const { data: session, update } = useSession(); // `update` pour rafraîchir la session côté client
  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // @ts-ignore
    setUsername(user?.username || session?.user?.username || '');
    // @ts-ignore
    setFirstName(user?.firstName || session?.user?.firstName || '');
    // @ts-ignore
    setLastName(user?.lastName || session?.user?.lastName || '');
  }, [user, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // TODO: Implémenter l'appel API pour mettre à jour le username (et autres champs si besoin)
    // Exemple:
    try {
      // const response = await fetch('/api/user/update-profile', { // Adaptez l'URL de l'API
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // @ts-ignore
      //     'Authorization': `Bearer ${session?.user?.accessToken}` // Si votre API attend un Bearer token
      //   },
      //   body: JSON.stringify({ username, firstName, lastName }),
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
      // }
      // 
      // const updatedUserData = await response.json();

      // Simulation d'un appel API réussi
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedUserData = {
        // @ts-ignore
        ...session?.user,
        username,
        firstName,
        lastName,
        name: `${firstName} ${lastName}` // Mettre à jour le nom complet aussi
      };

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      
      // Mettre à jour la session NextAuth côté client pour refléter les changements instantanément
      await update(updatedUserData); 
      // Si l'API renvoie l'objet utilisateur complet, y compris le nouveau token si celui-ci change au backend.
      // Sinon, vous pouvez passer seulement les champs modifiés:
      // await update({ user: { ...session?.user, username, firstName, lastName, name: `${firstName} ${lastName}` }});

    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // @ts-ignore
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Modifier mes Informations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            // L'email est généralement l'identifiant principal et non modifiable directement par l'utilisateur ici.
            // Si vous voulez permettre la modification du prénom/nom, ajoutez les champs ici.
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            id="lastName"           
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Champ Email (lecture seule) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (non modifiable)</label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  );
};

export default EditUserForm; 