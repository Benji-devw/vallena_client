'use client';

import { useState, useCallback, useEffect } from 'react';
import { SlidersHorizontal, ArrowUp, ArrowDown, Sparkles, PercentCircle, Grid, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortByProps {
  onViewModeChange?: (mode: 'grid' | 'horizontal') => void;
  viewMode?: 'grid' | 'horizontal';
}

type SortOption = {
  type: 'price' | 'promotion' | 'novelty';
  order?: 'asc' | 'desc';
  active: boolean;
};

export default function SortBy({ onViewModeChange, viewMode }: SortByProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [sortOptions, setSortOptions] = useState<Record<string, SortOption>>({
    priceAsc: { type: 'price', order: 'asc', active: false },
    priceDesc: { type: 'price', order: 'desc', active: false },
    promotion: { type: 'promotion', order: 'asc', active: false },
    novelty: { type: 'novelty', order: 'asc', active: false },
  });

  // Effect to handle URL updates
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortOptions(prev => {
        const newOptions = { ...prev };
        Object.keys(newOptions).forEach(key => {
          newOptions[key].active = false;
        });
        
        // Map URL parameter to sort option
        if (sortParam === 'price-asc') {
          newOptions.priceAsc.active = true;
        } else if (sortParam === 'price-desc') {
          newOptions.priceDesc.active = true;
        } else if (sortParam === 'promotions') {
          newOptions.promotion.active = true;
        } else if (sortParam === 'nouveautes') {
          newOptions.novelty.active = true;
        }
        
        return newOptions;
      });
    } else {
      setSortOptions(prev => {
        const newOptions = { ...prev };
        Object.keys(newOptions).forEach(key => {
          newOptions[key].active = false;
        });
        return newOptions;
      });
    }
  }, [searchParams]);

  const handleSort = useCallback((optionKey: string) => {
    // Update internal state
    setSortOptions(prev => {
      const newOptions = JSON.parse(JSON.stringify(prev)); // Deep copy
      Object.keys(newOptions).forEach(key => {
        if (key !== optionKey) {
          newOptions[key].active = false;
        }
      });
      
      const isActive = !prev[optionKey].active;
      newOptions[optionKey].active = isActive;
      
      return newOptions;
    });

    // Update URL in useEffect
    const urlParams = new URLSearchParams(window.location.search);
    const isActive = !sortOptions[optionKey].active;
    
    if (isActive) {
      let sortValue = '';
      switch (optionKey) {
        case 'priceAsc':
          sortValue = 'price-asc';
          break;
        case 'priceDesc':
          sortValue = 'price-desc';
          break;
        case 'promotion':
          sortValue = 'promotions';
          break;
        case 'novelty':
          sortValue = 'nouveautes';
          break;
      }
      
      urlParams.set('sort', sortValue);
    } else {
      urlParams.delete('sort');
    }
    
    // Update URL without full page reload
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [router, sortOptions]);

  const getButtonClass = (optionKey: string) => {
    const baseClass =
      'flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-colors duration-200';
    return `${baseClass} ${
      sortOptions[optionKey].active
        ? 'bg-primary-100 border-primary-300 text-primary-800 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-200'
        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-dark-700'
    }`;
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Trier par</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex gap-2 ${isOpen ? 'block' : 'hidden lg:flex'}`}>
        <button onClick={() => handleSort('priceAsc')} className={getButtonClass('priceAsc')}>
          <ArrowUp className="h-3 w-3" />
          Prix croissant
        </button>

        <button onClick={() => handleSort('priceDesc')} className={getButtonClass('priceDesc')}>
          <ArrowDown className="h-3 w-3" />
          Prix décroissant
        </button>

        <button onClick={() => handleSort('promotion')} className={getButtonClass('promotion')}>
          <PercentCircle className="h-3 w-3" />
          Promotions
        </button>

        <button onClick={() => handleSort('novelty')} className={getButtonClass('novelty')}>
          <Sparkles className="h-3 w-3" />
          Nouveautés
        </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="h-6 w-6" />
          </button>
          <button
            onClick={() => onViewModeChange?.('horizontal')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'horizontal'
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <List className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
