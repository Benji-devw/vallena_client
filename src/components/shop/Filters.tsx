'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

export default function Filters({ onFilterChange, categories, matters, colors }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isColorExpanded, setIsColorExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    matter: searchParams.get('matter') || '',
    color: searchParams.get('color') || '',
  });

  const PRICE_SLIDER_MAX_VALUE = '80';
  const DEBOUNCE_DELAY = 500;

  // check if there are active filters
  const hasActiveFilters = filters.category || filters.minPrice || filters.matter || filters.color;

  // effect to update the URL when the filters change (with debounce delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const hasParams =
        filters.category !== '' ||
        filters.matter !== '' ||
        filters.color !== '' ||
        filters.minPrice !== '';

      if (!hasParams) {
        const sortParam = params.get('sort');
        params.forEach((_, key) => {
          if (key !== 'sort') {
            params.delete(key);
          }
        });
        if (!sortParam) {
          router.replace('/shop');
          return;
        }
      } else {
        if (filters.category !== '') {
          params.set('category', filters.category);
        } else {
          params.delete('category');
        }
        if (filters.matter !== '') {
          params.set('matter', filters.matter);
        } else {
          params.delete('matter');
        }
        if (filters.color !== '') {
          params.set('color', filters.color);
        } else {
          params.delete('color');
        }
        if (filters.minPrice !== '') {
          params.set('minPrice', filters.minPrice);
        } else {
          params.delete('minPrice');
        }
        params.delete('maxPrice');
      }
      router.replace(`/shop?${params.toString()}`);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, router, searchParams]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      // Si on clique sur la même couleur, on la désélectionne
      if (filterType === 'color' && prev[filterType] === value) {
        newFilters[filterType] = '';
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    });
  };

  // Effet pour gérer l'appel à onFilterChange
  useEffect(() => {
    onFilterChange(true);
  }, [filters, onFilterChange]);

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hasActiveFilters) return;

    onFilterChange(true);

    setFilters({
      category: '',
      matter: '',
      color: '',
      minPrice: '',
    });

    router.replace('/shop');
  };

  return (
    <div
      className="sticky top-20 bg-white dark:bg-dark-800 rounded-lg shadow-sm p-4"
      data-testid="filters-container"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          data-testid="filters-title"
        >
          Filtres
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={e => handleReset(e)}
            disabled={!hasActiveFilters}
            className={` transition-colors ${
              hasActiveFilters
                ? 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
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

      <div
        className={`space-y-4 text-md ${isOpen ? 'block' : 'hidden lg:block'}`}
        data-testid="filters-content"
      >
        {/* Catégories */}
        <div data-testid="category-filter-section">
          <label className="label" data-testid="category-filter-label">
            Catégories
          </label>
          <select
            value={filters.category}
            onChange={e => handleFilterChange('category', e.target.value)}
            className="input"
            data-testid="category-filter-select"
          >
            <option value="" title="Toutes les catégories">
              ---
            </option>
            {categories.map(category => (
              <option
                key={category.id}
                value={category.id}
                data-testid={`category-option-${category.id}`}
              >
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
            onChange={e => handleFilterChange('matter', e.target.value)}
            className="input"
            data-testid="matter-filter-select"
          >
            <option value="" title="Toutes les matières">
              ---
            </option>
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
            <label
              className="block font-medium text-gray-700 dark:text-gray-300"
              data-testid="color-filter-label"
            >
              Couleur
            </label>
            <button
              onClick={() => setIsColorExpanded(!isColorExpanded)}
              className=" text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              data-testid="toggle-color-expand-button"
            >
              {isColorExpanded ? 'Réduire' : 'Voir plus'}
            </button>
          </div>
          <select
            value={filters.color}
            onChange={e => handleFilterChange('color', e.target.value)}
            className="input"
            data-testid="color-filter-select"
          >
            <option value="" title="Toutes les couleurs">
              ---
            </option>
            {colors.map(color => (
              <option key={color.id} value={color.id} data-testid={`color-option-${color.id}`}>
                {color.name}
              </option>
            ))}
          </select>
          <div
            className={`flex flex-wrap gap-2 mt-2 ${isColorExpanded ? 'block' : 'hidden'}`}
            data-testid="color-chips-container"
          >
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => handleFilterChange('color', color.id)}
                className={`flex flex-col items-center gap-2 px-3 py-1 rounded-sm  ${
                  filters.color === color.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : ' text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                data-testid={`color-chip-${color.id}`}
              >
                <span
                  className={`w-7 h-7 rounded-full ${
                    color.name === 'Bleu'
                      ? 'bg-blue-500'
                      : color.name === 'Rouge'
                        ? 'bg-red-500'
                        : color.name === 'Vert'
                          ? 'bg-green-500'
                          : color.name === 'Jaune'
                            ? 'bg-yellow-500'
                            : color.name === 'Noir'
                              ? 'bg-black'
                              : color.name === 'Blanc'
                                ? 'bg-white border border-gray-300'
                                : color.name === 'Gris'
                                  ? 'bg-gray-500'
                                  : color.name === 'Rose'
                                    ? 'bg-pink-500'
                                    : color.name === 'Orange'
                                      ? 'bg-orange-500'
                                      : color.name === 'Marron'
                                        ? 'bg-amber-800'
                                        : color.name === 'Violet'
                                          ? 'bg-purple-500'
                                          : color.name === 'Beige'
                                            ? 'bg-amber-100'
                                            : 'bg-gray-200'
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
            {/* Slider Min/Unique */}
            <div className="relative" data-testid="price-slider-container">
              <input
                type="range"
                min="0"
                max={PRICE_SLIDER_MAX_VALUE}
                step="10"
                value={filters.minPrice || '0'}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                className="range"
                data-testid="price-slider"
              />
              <div
                className="text-md text-gray-500 dark:text-gray-400 mt-1"
                data-testid="price-value-display"
              >
                {filters.minPrice && filters.minPrice === PRICE_SLIDER_MAX_VALUE
                  ? `${PRICE_SLIDER_MAX_VALUE}€ et plus`
                  : `${filters.minPrice || '0'}€`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
