'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';
// import { productService } from '@/services/api/productService';
import Modal from '@/components/ui/Modal';
// import LoginForm from '@/components/auth/LoginForm';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                <img src="/images/logo.png" alt="Vallena" className="w-12 h-12" />
              </span>
            </Link>

            {/* Barre de recherche */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-dark-600 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                           bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                           hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {/* Boutique */}
              <Link
                href="/shop"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </Link>

              {/* Panier */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Login/Profile */}
              {/* {isAuthenticated ? ( */}
                <div className="relative group">
                  <Link href="/auth" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="hidden md:inline">M'identifier</span>
                  </Link>
                </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Modal de connexion */}
      {/* <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Connexion" size="md">
        <LoginForm />
      </Modal> */}
    </>
  );
}
