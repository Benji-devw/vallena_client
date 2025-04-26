'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/api/productService';

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const products = await productService.searchProducts(searchTerm);
      // Rediriger vers la page shop avec les résultats
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-pink-600 text-white px-4 py-1 rounded-full hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
} 