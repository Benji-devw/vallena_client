'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService, Product, ProductFilters } from '@/services/api/productService';
import ProductCard from '@/components/shop/ProductCard';
import Filters from '@/components/shop/Filters';
import SortBy from '@/components/shop/SortBy';
import ProductSkeleton from '@/components/shop/ProductSkeleton';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
  const [allMatter, setAllMatter] = useState<{ id: string; name: string }[]>([]);
  const [allColors, setAllColors] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterChange, setIsFilterChange] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const lastProductRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [limit, setLimit] = useState(6);

  // function to load the categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await productService.getCategories();
        const matters = await productService.getMatters();
        const colors = await productService.getColors();
        setAllCategories(categories);
        setAllMatter(matters);
        setAllColors(colors);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Erreur lors du chargement des catégories');
      }
    };
    loadCategories();
  }, []);

  // function to load the products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();

        const filters: ProductFilters = {
          category: searchParams.get('category') || undefined,
          matter: searchParams.get('matter') || undefined,
          color: searchParams.get('color') || undefined,
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
          limit: limit,
          sort: searchParams.get('sort') || undefined,
        };

        const data = await productService.getAllProducts(filters);
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        setFilteredProducts(productsArray);
        setError(null);

        // Attendre au moins 1 seconde avant de masquer le skeleton
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
        setInitialLoadComplete(true);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Erreur lors du chargement des produits');
        setFilteredProducts([]);
        setInitialLoadComplete(true);
      } finally {
        setLoading(false);
        setIsFilterChange(false);
      }
    };
    loadProducts();
  }, [searchParams, limit]);

  // handler for filter change
  const handleFilterChange = useCallback((isLoading: boolean) => {
    setIsFilterChange(isLoading);
  }, []);

  const handleLoadMore = () => {
    setLimit(prev => prev + 6);
  };

  // console.log("🔍 comments", comments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900" data-testid="shop-page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
          data-testid="shop-title"
        >
          Shop
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-64" data-testid="shop-filters-container">
            <Filters
              onFilterChange={handleFilterChange}
              categories={allCategories}
              matters={allMatter}
              colors={allColors}
            />
          </div>

          {/* List of products */}
          <div className="flex-1" data-testid="shop-products-container">
            {/* sort and filters */}
            <div className="mb-4" data-testid="shop-sort-container">
              <SortBy
                onViewModeChange={setViewMode}
                viewMode={viewMode}
              />
            </div>

            {/* initial loading display */}
            {!initialLoadComplete ? (
              <div data-testid="shop-loading-skeleton">
                <ProductSkeleton viewMode={viewMode} />
              </div>
            ) : error ? (
              <div className="text-center text-red-500" data-testid="shop-error-message">
                {error}
              </div>
            ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500" data-testid="shop-empty-message">
                Aucun produit trouvé
              </div>
            ) : (
              <div className="relative" data-testid="shop-products-grid">
                {/* loading overlay for filter changes */}
                {isFilterChange && (
                  <div
                    className="absolute inset-0 bg-white/90 dark:bg-dark-900/90 z-10"
                    data-testid="shop-filter-loading-overlay"
                  >
                    <ProductSkeleton viewMode={viewMode} />
                  </div>
                )}

                {/* main container with height preservation */}
                <div className="min-h-[500px]">
                  {/* products grid with transition */}
                  <div
                    className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'} gap-0 transition-all duration-300 ease-in-out border-t border-l border-gray-200`}
                    data-testid="shop-products-layout"
                  >
                    {Array.isArray(filteredProducts) &&
                      filteredProducts.map((product, index) => (
                        <div
                          key={product._id}
                          ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                          className="transition-all duration-500 ease-in-out transform hover:text-primary-500-important border-r border-b border-gray-200"
                          style={{
                            opacity: 1,
                            animationFillMode: 'forwards',
                          }}
                          data-testid={`product-item-${product._id}`}
                        >
                          <ProductCard product={product} viewMode={viewMode} />
                        </div>
                      ))}
                  </div>

                  {/* Load more button */}
                  {filteredProducts.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-6 py-2 border border-primary-600 text-primary-600 hover:text-white hover:bg-primary-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="load-more-button"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Chargement...</span>
                          </div>
                        ) : (
                          'Voir plus'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
