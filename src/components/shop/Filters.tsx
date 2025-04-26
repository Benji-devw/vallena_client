'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (isLoading: boolean) => void;
  categories: {
    id: string;
    name: string;
  }[];
}

interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
}

export default function Filters({ onFilterChange, categories }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '0',
    maxPrice: searchParams.get('maxPrice') || '300'
  });

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = filters.category !== '' || 
    filters.minPrice !== '0' || 
    filters.maxPrice !== '300';

  // Effet pour mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const updateURL = () => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Mettre à jour uniquement les paramètres qui ont une valeur
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset la page à 1 quand les filtres changent
      params.set('page', '1');

      // Notifier le parent que le chargement commence
      onFilterChange(true);
      
      // Mettre à jour l'URL
      router.push(`/shop?${params.toString()}`);
    };

    updateURL();
  }, [filters, searchParams, router, onFilterChange]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      
      // S'assurer que minPrice n'est pas supérieur à maxPrice
      if (filterType === 'minPrice' && parseInt(value) > parseInt(prev.maxPrice)) {
        newFilters.maxPrice = value;
      }
      // S'assurer que maxPrice n'est pas inférieur à minPrice
      if (filterType === 'maxPrice' && parseInt(value) < parseInt(prev.minPrice)) {
        newFilters.minPrice = value;
      }
      
      return newFilters;
    });
  };

  const handleReset = () => {
    if (!hasActiveFilters) return;
    
    // Notifier le parent que le chargement commence
    onFilterChange(true);
    
    // Réinitialiser les filtres
    setFilters({
      category: '',
      minPrice: '0',
      maxPrice: '300'
    });

    // Mettre à jour l'URL directement
    router.push('/shop?page=1');
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`text-sm transition-colors ${
              hasActiveFilters
                ? "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            Réinitialiser
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Catégories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fourchette de prix
          </label>
          <div className="space-y-4">
            {/* Slider Min */}
            <div className="relative">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Prix minimum
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filters.minPrice}€
              </div>
            </div>

            {/* Slider Max */}
            <div className="relative">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Prix maximum
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filters.maxPrice}€
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
