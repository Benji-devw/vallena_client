'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { CategoryTypes, MatterTypes, ColorTypes } from '@/types/productTypes';

interface FiltersProps {
  onFilterChange: (isLoading: boolean) => void;
  categories: CategoryTypes[];
  matters: MatterTypes[];
  colors: ColorTypes[];
}

export interface FilterState {
  category: string;
  matter: string;
  color: string;
  maxPrice: string;
  minPrice: string;
}

export default function Filters({ onFilterChange, categories, matters, colors }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDropdowns, setOpenDropdowns] = useState({
    category: false,
    matter: false,
    color: false,
  });
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minPrice: searchParams.get('minPrice') || '',
    matter: searchParams.get('matter') || '',
    color: searchParams.get('color') || '',
  });
  const PRICE_SLIDER_MAX_VALUE = '80';
  const DEBOUNCE_DELAY = 500;

  // Effet pour réinitialiser les filtres quand l'URL change
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minPrice: searchParams.get('minPrice') || '',
      matter: searchParams.get('matter') || '',
      color: searchParams.get('color') || '',
    });
  }, [searchParams]);

  // check if there are active filters
  const hasActiveFilters = filters.category || filters.maxPrice || filters.matter || filters.color;

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      // Si on clique sur la même valeur, on la désélectionne
      if (prev[filterType] === value) {
        newFilters[filterType] = '';
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    });
  };

  const handlePriceChange = (value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === '0') {
        newFilters.minPrice = '';
        newFilters.maxPrice = '';
      } else if (value === PRICE_SLIDER_MAX_VALUE) {
        newFilters.minPrice = PRICE_SLIDER_MAX_VALUE;
        newFilters.maxPrice = '';
      } else {
        newFilters.maxPrice = value;
        newFilters.minPrice = '';
      }
      return newFilters;
    });
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hasActiveFilters) return;

    onFilterChange(true);

    setFilters({
      category: '',
      matter: '',
      color: '',
      maxPrice: '',
      minPrice: '',
    });

    router.replace('/shop');
  };

  const toggleDropdown = (dropdownName: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const handleOptionSelect = (filterType: keyof typeof filters, value: string) => {
    handleFilterChange(filterType, value);
    // setOpenDropdown(null);
  };

  const getSelectedCount = (type: keyof FilterState) => {
    return filters[type] ? 1 : 0;
  };

  // effect to update the URL when the filters change (with debounce delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const hasParams =
        filters.category !== '' ||
        filters.matter !== '' ||
        filters.color !== '' ||
        (filters.maxPrice !== '' && filters.maxPrice !== '0') ||
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
        // Gestion des prix
        if (filters.minPrice === PRICE_SLIDER_MAX_VALUE) {
          params.set('minPrice', filters.minPrice);
          params.delete('maxPrice');
        } else if (filters.maxPrice !== '' && filters.maxPrice !== '0') {
          params.set('maxPrice', filters.maxPrice);
          params.delete('minPrice');
        } else {
          params.delete('minPrice');
          params.delete('maxPrice');
        }
      }
      router.replace(`/shop?${params.toString()}`);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, router, searchParams]);

  // Effet for loading the products
  useEffect(() => {
    onFilterChange(true);
  }, [filters, onFilterChange]);

  return (
    <div className="max-h-[calc(100vh-10rem)] sticky top-20 p-4" data-testid="filters-container">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" data-testid="filters-title">
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
            onClick={() =>
              setOpenDropdowns({
                category: !openDropdowns.category,
                matter: false,
                color: false,
              })
            }
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div
        className={`space-y-4 text-md overflow-y-auto max-h-[calc(100vh-15rem)] ${openDropdowns.category ? 'block' : 'hidden lg:block'}`}
        data-testid="filters-content"
      >
        {/* Catégories Accordion */}
        <div className="border-t overflow-hidden">
          <button
            onClick={() => toggleDropdown('category')}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-700"
            aria-expanded={openDropdowns.category}
            aria-controls="category-accordion"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">Catégories</span>
              {getSelectedCount('category') > 0 && (
                <span className="text-sm text-gray-500">({getSelectedCount('category')})</span>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${openDropdowns.category ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id="category-accordion"
            className={`grid transition-all duration-200 ease-in-out ${
              openDropdowns.category ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleOptionSelect('category', '')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                    filters.category === '' ? 'bg-primary-50 text-primary-700' : ''
                  }`}
                >
                  <span>Toutes les catégories</span>
                  {filters.category === '' && <Check className="h-4 w-4 text-primary-500" />}
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleOptionSelect('category', category.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                      filters.category === category.id ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    {filters.category === category.id && <Check className="h-4 w-4 text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matter Accordion */}
        <div className="border-t overflow-hidden">
          <button
            onClick={() => toggleDropdown('matter')}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-700"
            aria-expanded={openDropdowns.matter}
            aria-controls="matter-accordion"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">Matière</span>
              {getSelectedCount('matter') > 0 && (
                <span className="text-sm text-gray-500">({getSelectedCount('matter')})</span>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${openDropdowns.matter ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id="matter-accordion"
            className={`grid transition-all duration-200 ease-in-out ${
              openDropdowns.matter ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleOptionSelect('matter', '')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                    filters.matter === '' ? 'bg-primary-50 text-primary-700' : ''
                  }`}
                >
                  <span>Toutes les matières</span>
                  {filters.matter === '' && <Check className="h-4 w-4 text-primary-500" />}
                </button>
                {matters.map(matter => (
                  <button
                    key={matter.id}
                    onClick={() => handleOptionSelect('matter', matter.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                      filters.matter === matter.id ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <span>{matter.name}</span>
                    {filters.matter === matter.id && <Check className="h-4 w-4 text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Accordion */}
        <div className="border-t overflow-hidden">
          <button
            onClick={() => toggleDropdown('color')}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-700"
            aria-expanded={openDropdowns.color}
            aria-controls="color-accordion"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">Couleur</span>
              {getSelectedCount('color') > 0 && (
                <span className="text-sm text-gray-500">({getSelectedCount('color')})</span>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${openDropdowns.color ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id="color-accordion"
            className={`grid transition-all duration-200 ease-in-out ${
              openDropdowns.color ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleOptionSelect('color', '')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                    filters.color === '' ? 'bg-primary-50 text-primary-700' : ''
                  }`}
                >
                  <span>Toutes les couleurs</span>
                  {filters.color === '' && <Check className="h-4 w-4 text-primary-500" />}
                </button>
                {colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => handleOptionSelect('color', color.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md flex items-center justify-between ${
                      filters.color === color.id ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full ${
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
                      />
                      <span>{color.name}</span>
                    </div>
                    {filters.color === color.id && <Check className="h-4 w-4 text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price Slider */}
        <div className="border-t overflow-hidden">
          <div className="flex items-center justify-between p-3">
            <span className="font-semibold">Prix</span>
            {filters.minPrice === PRICE_SLIDER_MAX_VALUE ? (
              <span className="text-sm text-gray-500">{`${PRICE_SLIDER_MAX_VALUE}€ et plus`}</span>
            ) : filters.maxPrice && filters.maxPrice !== '0' ? (
              <span className="text-sm text-gray-500">{`${filters.maxPrice}€ et moins`}</span>
            ) : null}
          </div>
          <div className="px-3 py-2">
            <input
              type="range"
              min="0"
              max={PRICE_SLIDER_MAX_VALUE}
              step="10"
              value={
                filters.minPrice === PRICE_SLIDER_MAX_VALUE
                  ? PRICE_SLIDER_MAX_VALUE
                  : filters.maxPrice || '0'
              }
              onChange={e => handlePriceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
