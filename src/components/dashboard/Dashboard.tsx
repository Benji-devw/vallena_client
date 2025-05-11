'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import UserProfile from '@/components/dashboard/userProfile/UserProfile';
import UserOrders from '@/components/dashboard/userOrders/UserOrders';
import { AsideDashboard } from '@/components/dashboard/Aside';
import { CiUser, CiShoppingCart, CiSettings } from 'react-icons/ci';
import { orderService } from '@/services/api/orderService';
// import EditUserForm from './dashboard/EditUserForm';
// import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [activeView, setActiveView] = useState('profile');
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [debug, setDebug] = useState([]);

  const sidebarRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const asideItems = [
    {
      label: 'Profil',
      icon: <CiUser className="w-8 h-8" />,
      view: 'profile',
    },
    {
      label: 'Commandes',
      icon: <CiShoppingCart className="w-8 h-8" />,
      view: 'orders',
    },
    {
      label: 'Paramètres',
      icon: <CiSettings className="w-8 h-8" />,
      view: 'settings',
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await orderService.getUserOrders(session?.user?.id || '');
        // Récupérer les données depuis la réponse API
        setDebug(orders.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setDebug([]);
      }
    }
    
    if (session?.user?.id) {
      fetchOrders();
    }

    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!isSidebarToggled || keyCode !== 27) return;
      setIsSidebarToggled(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [isSidebarToggled, session]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Chargement de la session...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">
          Aucune session active ou utilisateur non défini. Vous n'êtes pas connecté.
        </p>
      </div>
    );
  }

  const userRoles = session.user?.roles || ['user'];

  const handleMenuClick = (view: string) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarToggled(false);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'profile':
        return <UserProfile user={session.user} />;
      case 'orders':
        return <UserOrders user={session.user} />;
      // case 'edit':
      //   return <EditUserForm user={session.user} />;
      default:
        return <UserProfile user={session.user} />;
    }
  };

  // console.log(debug);
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside
        ref={sidebarRef}
        className={`sidebar fixed top-0 left-0 z-[220] flex h-[calc(100vh-120px)] w-[290px] rounded-lg flex-col border-r border-gray-200 bg-white px-4 transition-all duration-300 dark:border-gray-800 dark:bg-black lg:sticky lg:top-[114px] lg:z-40 lg:translate-x-0 ${isSidebarToggled ? 'translate-x-0 lg:w-[90px]' : '-translate-x-full lg:w-[290px]'}`}
      >
        {/* SIDEBAR HEADER (Logo et bouton de fermeture mobile) */}
        {/* <div
          className={`sidebar-header flex items-center gap-2 pt-8 pb-7 ${isSidebarToggled ? "justify-center" : "justify-between"}`}
        >
          <a href="/dashboard"> 
            <span className={`logo ${isSidebarToggled && "lg:hidden"}`}>
              <img className="dark:hidden h-8 w-auto" src="/images/logo/logo.svg" alt="Logo" />
              <img className="hidden dark:block h-8 w-auto" src="/images/logo/logo-dark.svg" alt="Logo Dark" />
            </span>
            <img
                className="logo-icon h-8 w-auto"
                src="/images/logo/logo-icon.svg"
                alt="Logo Icon"
            />
          </a>
           <button
            onClick={() => setIsSidebarToggled(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div> */}

        {/* Aside content */}
        <AsideDashboard
          items={asideItems}
          isSidebarToggled={isSidebarToggled}
          activeView={activeView}
          userRoles={userRoles as string[]} // Cast si certain que roles est string[]
          handleMenuClick={handleMenuClick}
        />
      </aside>

      {/* Overlay pour les mobiles */}
      {isSidebarToggled && (
        <div
          onClick={() => setIsSidebarToggled(false)}
          className="fixed inset-0 z-[200] bg-black/50 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <button
          ref={triggerRef}
          onClick={() => setIsSidebarToggled(!isSidebarToggled)}
          className="mb-4 p-2 border rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        {renderView()}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Session (Debug)
          </h3>
          <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        <div className="max-h-[300px] overflow-y-auto mt-8 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Orders User (Debug)
          </h3>
          <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
