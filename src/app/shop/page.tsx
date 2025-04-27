'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService, Product, ProductFilters } from '@/services/api/productService';
import ProductCard from '@/components/shop/ProductCard';
import Filters from '@/components/shop/Filters';
import SortBy from '@/components/shop/SortBy';
import ProductSkeleton from '@/components/shop/ProductSkeleton';
import { commentsService, Comment } from '@/services/api/commentsService';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string; }[]>([]);
  const [allMatter, setAllMatter] = useState<{ id: string; name: string; }[]>([]);
  const [allColors, setAllColors] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterChange, setIsFilterChange] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const lastProductRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');

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
        setShowSkeleton(true);
        const startTime = Date.now();

        const filters: ProductFilters = {
          category: searchParams.get('category') || undefined,
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
          matter: searchParams.get('matter') || undefined,
          color: searchParams.get('color') || undefined,
          page: parseInt(searchParams.get('page') || '1'),
          limit: 12
        };

        const data = await productService.getAllProducts(filters);
        const productsArray = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : [];
        
        if (parseInt(searchParams.get('page') || '1') === 1) {
          setProducts(productsArray);
          setFilteredProducts(productsArray);
        } else {
          setProducts(prev => [...prev, ...productsArray]);
          setFilteredProducts(prev => [...prev, ...productsArray]);
        }
        setError(null);

        // Attendre au moins 1 seconde avant de masquer le skeleton
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
        setShowSkeleton(false);
        setInitialLoadComplete(true);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Erreur lors du chargement des produits');
        setProducts([]);
        setFilteredProducts([]);
        setShowSkeleton(false);
        setInitialLoadComplete(true);
      } finally {
        setLoading(false);
        setIsFilterChange(false);
      }
    };
    loadProducts();

    const loadComments = async () => {
      // const comments = await commentsService.getComments();
      setComments(comments);
    };
    loadComments();
  }, [searchParams]);

  // handler for filter change
  const handleFilterChange = useCallback((isLoading: boolean) => {
    setIsFilterChange(isLoading);
  }, []);

  // handler for product sort
  const handleProductsSort = useCallback((sortedProducts: Product[]) => {
    setFilteredProducts(sortedProducts);
  }, []);

  // console.log("🔍 comments", comments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900" data-testid="shop-page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8" data-testid="shop-title">Shop</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-64" data-testid="shop-filters-container">
            <Filters onFilterChange={handleFilterChange} categories={allCategories} matters={allMatter} colors={allColors} />
          </div>

          {/* List of products */}
          <div className="flex-1" data-testid="shop-products-container">
            {/* sort and filters */}
            <div className="mb-4" data-testid="shop-sort-container">
              <SortBy 
                products={products}
                onProductsSort={handleProductsSort}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
              />
            </div>
            
            {/* initial loading display */}
            {!initialLoadComplete ? (
              <div data-testid="shop-loading-skeleton">
                <ProductSkeleton />
              </div>
            ) : error ? (
              <div className="text-center text-red-500" data-testid="shop-error-message">{error}</div>
            ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500" data-testid="shop-empty-message">Aucun produit trouvé</div>
            ) : (
              <div className="relative" data-testid="shop-products-grid">
                {/* loading overlay for filter changes */}
                {isFilterChange && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-dark-900/90 z-10" data-testid="shop-filter-loading-overlay">
                    <ProductSkeleton />
                  </div>
                )}
                
                {/* main container with height preservation */}
                <div className="min-h-[500px]">
                  {/* products grid with transition */}
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'} gap-6 transition-all duration-300 ease-in-out`} data-testid="shop-products-layout">
                    {Array.isArray(filteredProducts) && filteredProducts.map((product, index) => (
                      <div
                        key={product._id}
                        ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                        className="transition-all duration-500 ease-in-out transform hover:text-primary-500-important"
                        style={{ 
                          opacity: 1,
                          animationFillMode: 'forwards' 
                        }}
                        data-testid={`product-item-${product._id}`}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                  
                  {/* loading indicator for infinite scroll */}
                  {loading && parseInt(searchParams.get('page') || '1') > 1 && (
                    <div className="col-span-full flex justify-center py-4" data-testid="shop-infinite-scroll-loader">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
