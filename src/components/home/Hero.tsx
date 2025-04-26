'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Vallena Couture
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12">
          Découvrez notre collection unique de vêtements sur mesure
        </p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 