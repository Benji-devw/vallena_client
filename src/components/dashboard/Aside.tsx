'use client';

import React from 'react';
import { CiUser, CiShoppingCart, CiEdit } from "react-icons/ci";

interface AsideProps {
  isSidebarToggled: boolean;
  activeView: string;
  userRoles: string[];
  handleMenuClick: (view: string) => void;
  // Ajoutez d'autres props si nécessaire, par exemple pour les icônes si elles sont passées en props
}

export const AsideDashboard: React.FC<AsideProps> = ({
  isSidebarToggled,
  activeView,
  userRoles,
  handleMenuClick,
}) => {
  return (
    <div className="flex flex-col overflow-y-auto duration-300 ease-linear h-full">
      {' '}
      {/* h-full pour prendre la hauteur restante */}
      <nav>
        <div>
          <h3 className="mb-4 p-2 text-md leading-[20px] text-gray-400 uppercase dark:text-gray-500">
            <span className={`menu-group-title ${isSidebarToggled ? 'lg:hidden' : ''}`}>
              Menu
            </span>
          </h3>

          <ul className="mb-6 flex flex-col gap-1.5">
            <li>
              <button
                onClick={() => handleMenuClick('profile')}
                className={`group relative flex w-full items-center gap-2.5 rounded-md font-medium text-gray-700 duration-300 ease-in-out hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${activeView === 'profile' && 'bg-gray-100 dark:bg-gray-700'} ${isSidebarToggled ? 'justify-center px-2 py-4' : 'px-4 py-2'}`}
              >
                <CiUser className={`w-8 h-8 font-bold ${activeView === 'profile' ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`menu-item-text ${isSidebarToggled ? 'sm:hidden' : ''}`}>
                  Mon Profil
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick('orders')}
                className={`group relative flex w-full items-center gap-2.5 rounded-md font-medium text-gray-700 duration-300 ease-in-out hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${activeView === 'orders' && 'bg-gray-100 dark:bg-gray-700'} ${isSidebarToggled ? 'justify-center px-2 py-4' : 'px-4 py-2'}`}
              >
                <CiShoppingCart className={`w-8 h-8 ${activeView === 'orders' ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`menu-item-text ${isSidebarToggled ? 'lg:hidden' : ''}`}>
                  Mes Commandes
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuClick('edit')}
                className={`group relative flex w-full items-center gap-2.5 rounded-md font-medium text-gray-700 duration-300 ease-in-out hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${activeView === 'edit' && 'bg-gray-100 dark:bg-gray-700'} ${isSidebarToggled ? 'justify-center px-2 py-4' : 'px-4 py-2'}`}
              >
                <CiEdit className={`w-8 h-8 ${activeView === 'edit' ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`menu-item-text ${isSidebarToggled ? 'lg:hidden' : ''}`}>
                  Modifier mes infos
                </span>
              </button>
            </li>
            {/* TODO: Ajouter des liens spécifiques aux rôles admin/god/superGod ici */}
          </ul>
        </div>
      </nav>
      {/* Partie inférieure de la sidebar (Rôles et Promo Box) */}
      <div className="mt-auto mb-4">
        <div className={`px-4 py-2 ${isSidebarToggled ? 'text-center' : ''}`}>
          <p
            className={`text-xs text-gray-500 dark:text-gray-400 ${isSidebarToggled ? 'lg:hidden' : ''}`}
          >
            Rôle(s):
          </p>
          <p
            className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isSidebarToggled ? 'lg:hidden' : ''}`}
          >
            {userRoles && userRoles.length > 0 ? userRoles.join(', ') : 'user'}
          </p>
        </div>

        <div
          className={`mx-auto mb-6 w-full max-w-[200px] rounded-xl bg-gray-50 p-3 text-center dark:bg-white/[.03] ${isSidebarToggled ? 'lg:hidden' : ''}`}
        >
          <h3 className="mb-1.5 font-semibold text-gray-800 dark:text-white text-sm">
            Vallena Project
          </h3>
          <p className="text-xs mb-2.5 text-gray-500 dark:text-gray-400">Votre espace client.</p>
        </div>
      </div>
    </div>
  );
};
