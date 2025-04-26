'use client';

import { useState, useCallback, useEffect } from 'react';
import { SlidersHorizontal, ArrowUp, ArrowDown, Sparkles, PercentCircle } from 'lucide-react';
import { Product } from '@/services/api/productService';

interface SortByProps {
  products: Product[];
  onProductsSort: (sortedProducts: Product[]) => void;
}

type SortOption = {
  type: 'price' | 'promotion' | 'novelty';
  order?: 'asc' | 'desc';
  active: boolean;
};

export default function SortBy({ products, onProductsSort }: SortByProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOptions, setSortOptions] = useState<Record<string, SortOption>>({
    priceAsc: { type: 'price', order: 'asc', active: false },
    priceDesc: { type: 'price', order: 'desc', active: false },
    promotion: { type: 'promotion', order: 'asc', active: false },
    novelty: { type: 'novelty', order: 'asc', active: false },
  });

  // Effect to apply the sort when the options change
  useEffect(() => {
    // Apply the sort
    let sortedProducts = [...products];

    // Appliquer les tris actifs
    if (sortOptions.priceAsc.active) {
      sortedProducts.sort((a, b) => a.priceProduct - b.priceProduct);
    } else if (sortOptions.priceDesc.active) {
      sortedProducts.sort((a, b) => b.priceProduct - a.priceProduct);
    }

    if (sortOptions.promotion.active) {
      sortedProducts.sort((a, b) => {
        if (a.promotionProduct === b.promotionProduct) {
          // If both are in promotion or not, keep the current order
          return 0;
        }
        // Put the products in promotion first
        return a.promotionProduct ? -1 : 1;
      });
    }

    if (sortOptions.novelty.active) {
      sortedProducts.sort((a, b) => {
        if (a.novelty === b.novelty) {
          // If both are new or not, sort by creation date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Put the novelty in first
        return a.novelty ? -1 : 1;
      });
    }

    // Update the list of sorted products
    onProductsSort(sortedProducts);
  }, [products, sortOptions, onProductsSort]);

  const handleSort = useCallback((optionKey: string) => {
    setSortOptions(prev => {
      const newOptions = JSON.parse(JSON.stringify(prev)); // Deep copy
      Object.keys(newOptions).forEach(key => {
        if (key !== optionKey) {
          newOptions[key].active = false;
        }
      });
      newOptions[optionKey].active = !prev[optionKey].active;
      return newOptions;
    });
  }, []);
  
  
  

  const getButtonClass = (optionKey: string) => {
    const baseClass =
      'flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-colors duration-200';
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

      <div className={`flex flex-wrap gap-2 ${isOpen ? 'block' : 'hidden lg:flex'}`}>
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
    </div>
  );
}
