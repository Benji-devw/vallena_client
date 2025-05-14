'use client';

import React, { useState } from 'react';
import { User } from 'next-auth'; // Importer le type User de next-auth
import Modal from '@/components/ui/Modal';
import EditUserForm from './EditUserForm';
import { userService } from '@/services/api/userService';
import { signOut } from 'next-auth/react';

interface UserProfileProps {
  user: User | undefined;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  if (!user) {
    return <p>Aucune information utilisateur disponible.</p>;
  }

  const handleDeleteUser = () => {
    if (confirm('Voulez-vous vraiment supprimer ce compte ?')) {
      userService.deleteUser(user?.id || '').then(() => {
        signOut({ callbackUrl: '/' });
      });
    }
  };

  // console.log(user);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center sm:flex-row flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h2>
        <button
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            ></path>
          </svg>
          Edit
        </button>
      </div>

      {/* Profile preview */}
      <div className="p-5 mb-6 lg:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center w-full gap-6 sm:flex-row">
            <div className="w-24 h-24 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={user.image || user.picture || '/images/default-avatar.svg'}
                alt={user.name || user.username || 'Avatar'}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {user.firstName} {user.lastName}
              </h4>
              <p className="text-md mt-2 text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-md mt-2 text-gray-500 dark:text-gray-400">
                Pseudo: <b>{user.username || ''}</b>
              </p>
              {/* <p className="text-md text-gray-500 dark:text-gray-400">{user.id}</p> */}
              <div className="flex flex-col items-center mt-2 gap-1 text-left sm:flex-row sm:gap-3">
                <p className="text-md text-gray-500 dark:text-gray-400">
                  Rôle:{' '}
                  <b>
                    {user.roles && Array.isArray(user.roles)
                      ? user.roles.join(', ')
                      : 'Non définie'}
                  </b>
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 sm:block"></div>
                <p className="text-md text-gray-500 dark:text-gray-400">
                  ID: <b>{user.id}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User personal information */}
      <div className="p-5 mb-6 border border-gray-200 rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col justify-between items-center mb-5 sm:flex-row sm:items-start">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informations personnelles
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 max-w-2xl">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Prénom</p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.firstName}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nom</p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.lastName}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.email}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Téléphone
            </p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.phone}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Pays</p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.country}</p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
            <p className="text-md font-medium text-gray-800 dark:text-white/90">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-white dark:bg-gray-800">
        <button
          onClick={() => {
            handleDeleteUser();
          }}
          className="mt-8 p-4 bg-red-100 dark:bg-red-100 hover:bg-red-400 dark:hover:bg-red-200 rounded shadow"
        >
          Supprimer mon compte
        </button>
      </div>

      {isProfileDropdownOpen && (
        <Modal isOpen={isProfileDropdownOpen} onClose={() => setIsProfileDropdownOpen(false)}>
          <EditUserForm user={user} />
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;
