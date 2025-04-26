'use client';

import { useState, useEffect } from 'react';
import { productService, Product } from '@/services/api/productService';
import Image from 'next/image';

export default function PromotionalProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionalProducts = async () => {
      try {
        setLoading(true);
        const promotionalProducts = await productService.getPromotionalProducts();
        setProducts(promotionalProducts);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Aucun produit en promotion pour le moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-pink-600">
                {product.price.toFixed(2)} €
              </span>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 