'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productService, Product, ProductFilters } from '@/services/api/productService';
import ProductCard from '@/components/shop/ProductCard';
import Filters from '@/components/shop/Filters';
import SortBy from '@/components/shop/SortBy';

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterChange, setIsFilterChange] = useState(false);
  const lastProductRef = useRef<HTMLDivElement>(null);

  // Fonction pour charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await productService.getCategories();
        setAllCategories(categories);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Erreur lors du chargement des catégories');
      }
    };
    loadCategories();
  }, []);

  // Fonction pour charger les produits
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters: ProductFilters = {
          category: searchParams.get('category') || undefined,
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
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
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Erreur lors du chargement des produits');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
        setIsFilterChange(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  // Gestionnaire de changement de filtres
  const handleFilterChange = useCallback((isLoading: boolean) => {
    setIsFilterChange(isLoading);
  }, []);

  // Gestionnaire de tri des produits
  const handleProductsSort = useCallback((sortedProducts: Product[]) => {
    setFilteredProducts(sortedProducts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notre Boutique</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <div className="w-full lg:w-64">
            <Filters onFilterChange={handleFilterChange} categories={allCategories} />
          </div>

          {/* Liste des produits */}
          <div className="flex-1">
            {/* tri et filtres */}
            <div className="mb-4">
              <SortBy 
                products={products}
                onProductsSort={handleProductsSort}
              />
            </div>
            
            {/* Affichage du chargement initial */}
            {loading && !isFilterChange && parseInt(searchParams.get('page') || '1') === 1 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">Aucun produit trouvé</div>
            ) : (
              <div className="relative">
                {/* Overlay de chargement pour les changements de filtres */}
                {isFilterChange && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-dark-900 dark:bg-opacity-70 z-10 flex items-center justify-center transition-opacity duration-300 ease-in-out">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                )}
                
                {/* Conteneur principal avec préservation de la hauteur */}
                <div className="min-h-[500px]">
                  {/* Grille de produits avec transition */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-in-out">
                    {Array.isArray(filteredProducts) && filteredProducts.map((product, index) => (
                      <div
                        key={product._id}
                        ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                        className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]"
                        style={{ 
                          opacity: 1,
                          animationFillMode: 'forwards' 
                        }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicateur de chargement pour le scroll infini */}
                  {loading && parseInt(searchParams.get('page') || '1') > 1 && (
                    <div className="col-span-full flex justify-center py-4">
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
