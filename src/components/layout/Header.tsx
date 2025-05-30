'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  CiUser,
  CiShoppingCart,
  CiShop,
  CiSearch,
  CiMenuBurger,
  CiCircleRemove,
  CiLogin,
} from 'react-icons/ci';
// import Modal from '@/components/ui/Modal';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
  };

  const itemsCategories = [
    {
      label: 'Nouveautés',
      href: '/shop?sort=nouveautes',
    },
    {
      label: 'Homme',
      href: '/shop?category=homme',
    },
    {
      label: 'Femme',
      href: '/shop?category=femme',
    },
    {
      label: 'Enfant',
      href: '/shop?category=enfant',
    },
    {
      label: 'Promotions',
      href: '/shop?sort=promotions',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-800">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-dark-800">
          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
            <div className="flex justify-end items-center h-10">
              {/* Navigation */}
              <nav className="flex">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/help"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Aide
                  </Link>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <Link
                    href="/contact"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Contact
                  </Link>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-800">
          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600">
                    <img src="/images/logo.png" alt="Vallena" className="w-12 h-12" />
                  </span>
                </Link>
              </div>

              {/* Categories */}
              <nav className="hidden lg:flex flex-1 items-center justify-center">
                {itemsCategories.map(item => (
                  <Link
                    key={item.label}
                    // href={item.href}
                    className="px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    href={`${item.href.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative hidden sm:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Rechercher"
                    className="h-10 w-40 md:w-56 px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-dark-600 
                             focus:border-primary-500 dark:focus:ring-primary-400
                            bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                            hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    onClick={() => router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)}
                  >
                    <CiSearch className="h-5 w-5" />
                  </button>
                </form>
                <button
                  onClick={() => {
                    /* Logique pour afficher la recherche mobile si besoin */
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors sm:hidden"
                >
                  <CiSearch className="h-6 w-6" />
                </button>

                {/* Shop */}
                <nav className="flex items-center space-x-1 md:space-x-2">
                  <Link
                    href="/shop"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <CiShop className="h-8 w-8" />
                  </Link>

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <CiShoppingCart className="h-8 w-8" />
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </Link>

                  {/* Profile/Login Dropdown */}
                  <div className="relative flex items-center justify-center min-w-[48px] min-h-[48px]">
                    {status === 'loading' ? (
                      <div className="h-10 w-10 bg-gray-200 dark:bg-dark-700 rounded-full animate-pulse" />
                    ) : status === 'authenticated' ? (
                      <>
                        <button
                          type="button"
                          aria-label="Ouvrir le menu profil"
                          onClick={() => setIsProfileDropdownOpen(open => !open)}
                          onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 100)}
                          className="p-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <img
                            src={session?.user?.image || '/images/default-avatar.svg'}
                            alt={session?.user?.name || 'Avatar'}
                            className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-dark-600"
                          />
                        </button>
                        {isProfileDropdownOpen && (
                          <div className="absolute top-14 right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              Mon Compte
                            </Link>
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
                            >
                              Se déconnecter
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        aria-label="Connexion"
                        onClick={() => router.push('/auth')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      >
                        <CiUser className="h-8 w-8" />
                      </button>
                    )}
                  </div>
                </nav>

                <div className="flex items-center lg:hidden">
                  <button
                    className="m-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none"
                    aria-label="Ouvrir le menu"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <span className="sr-only">Ouvrir le menu principal</span>
                    {isMobileMenuOpen ? (
                      <CiCircleRemove className="h-6 w-6" />
                    ) : (
                      <CiMenuBurger className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-dark-800 shadow-lg rounded-b-md">
              <ul className="flex flex-col items-start py-2 px-2 space-y-1">
                {itemsCategories.map(item => (
                  <li key={item.label}>
                    <Link
                      href={item.href.toLowerCase()}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push(item.href.toLowerCase());
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
