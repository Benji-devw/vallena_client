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
  matters: {
    id: string;
    name: string;
  }[];
  colors: {
    id: string;
    name: string;
  }[];
}

interface FilterState {
  category: string;
  matter: string;
  color: string;
  minPrice: string;
  maxPrice: string;
}

export default function Filters({ onFilterChange, categories, matters, colors }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isColorExpanded, setIsColorExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    matter: searchParams.get('matter') || '',
    color: searchParams.get('color') || '',
  });

  // check if there are active filters
  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.matter || filters.color;

  // effect to update the URL when the filters change
  useEffect(() => {
    const updateURL = () => {
      const params = new URLSearchParams();
      
      // update only the parameters that have a value different from the default values
      if (filters.category !== '') {
        params.set('category', filters.category);
      }
      if (filters.matter !== '') {
        params.set('matter', filters.matter);
      }
      if (filters.color !== '') {
        params.set('color', filters.color);
      }
      if (filters.minPrice !== '') {
        params.set('minPrice', filters.minPrice);
      }
      if (filters.maxPrice !== '') {
        params.set('maxPrice', filters.maxPrice);
      }

      // reset the page to 1 when the filters change
      params.set('page', '1');

      // notify the parent that the loading starts
      onFilterChange(true);
      
      // use replace with scroll: false to avoid the history
      router.replace(`/shop?${params.toString()}`, { scroll: false });
    };

    updateURL();
  }, [filters, router, onFilterChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(true);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hasActiveFilters) return;
    
    // notify the parent that the loading starts
    onFilterChange(true);
    
    // reset filters
    setFilters({
      category: '',
      matter: '',
      color: '',
      minPrice: '',
      maxPrice: '',
    });

    // use replace with scroll: false
    router.replace('/shop', { scroll: false });
  };

  return (
    <div className="sticky top-20 bg-white dark:bg-dark-800 rounded-lg shadow-sm p-4" data-testid="filters-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="filters-title">Filtres</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => handleReset(e)}
            disabled={!hasActiveFilters}
            className={`text-sm transition-colors ${
              hasActiveFilters
                ? "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
            data-testid="reset-filters-button"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden lg:block'}`} data-testid="filters-content">
        {/* Catégories */}
        <div data-testid="category-filter-section">
          <label className="label" data-testid="category-filter-label">
            Catégories
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input"
            data-testid="category-filter-select"
          >
            <option value="" title="Toutes les catégories">---</option>
            {categories.map(category => (
              <option key={category.id} value={category.id} data-testid={`category-option-${category.id}`}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Matter */}
        <div data-testid="matter-filter-section">
          <label className="label" data-testid="matter-filter-label">
            Matière
          </label>
          <select
            value={filters.matter}
            onChange={(e) => handleFilterChange('matter', e.target.value)}
            className="input"
            data-testid="matter-filter-select"
          >
            <option value="" title="Toutes les matières">---</option>
            {matters.map(matter => (
              <option key={matter.id} value={matter.id} data-testid={`matter-option-${matter.id}`}>
                {matter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div data-testid="color-filter-section">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="color-filter-label">
              Couleur
            </label>
            <button
              onClick={() => setIsColorExpanded(!isColorExpanded)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              data-testid="toggle-color-expand-button"
            >
              {isColorExpanded ? 'Réduire' : 'Voir plus'}
            </button>
          </div>
          <select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="input"
            data-testid="color-filter-select"
          >
            <option value="" title="Toutes les couleurs">---</option>
            {colors.map(color => (  
              <option key={color.id} value={color.id} data-testid={`color-option-${color.id}`}>
                {color.name}
              </option>
            ))}
          </select>
          <div className={`flex flex-wrap gap-2 mt-2 ${isColorExpanded ? 'block' : 'hidden'}`} data-testid="color-chips-container">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => handleFilterChange('color', color.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  filters.color === color.id 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                data-testid={`color-chip-${color.id}`}
              >
                <span 
                  className={`w-5 h-5 rounded-full ${
                    color.name === 'Bleu' ? 'bg-blue-500' :
                    color.name === 'Rouge' ? 'bg-red-500' :
                    color.name === 'Vert' ? 'bg-green-500' :
                    color.name === 'Jaune' ? 'bg-yellow-500' :
                    color.name === 'Noir' ? 'bg-black' :
                    color.name === 'Blanc' ? 'bg-white border border-gray-300' :
                    color.name === 'Gris' ? 'bg-gray-500' :
                    color.name === 'Rose' ? 'bg-pink-500' :
                    color.name === 'Orange' ? 'bg-orange-500' :
                    color.name === 'Marron' ? 'bg-amber-800' :
                    color.name === 'Violet' ? 'bg-purple-500' :
                    color.name === 'Beige' ? 'bg-amber-100' :
                    'bg-gray-200'
                  }`}
                  data-testid={`color-chip-swatch-${color.id}`}
                />
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div data-testid="price-filter-section">
          <label className="label" data-testid="price-filter-label">
            Prix
          </label>
          <div className="space-y-4">
            {/* Slider Min */}
            <div className="relative" data-testid="min-price-filter">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Prix minimum
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={filters.minPrice || 0}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="range"
                data-testid="min-price-slider"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1" data-testid="min-price-value">
                {filters.minPrice || 0}€
              </div>
            </div>

            {/* Slider Max */}
            <div className="relative" data-testid="max-price-filter">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Prix maximum
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={filters.maxPrice || 300}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="range"
                data-testid="max-price-slider"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1" data-testid="max-price-value">
                {filters.maxPrice || 300}€
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
