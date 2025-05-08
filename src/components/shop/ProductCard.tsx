import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/services/api/productService';
import { Heart, ShoppingCart } from 'lucide-react';
import ColorCircle from '@/components/ui/ColorCircle';
import { Star } from 'lucide-react';
import { commentsService } from '@/services/api/commentService';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'horizontal';
  comments?: Comment[];
}

interface Comment {
  _id: string;
  orderNumber: string;
  idProduct: string;
  by: string;
  messageTitle: string;
  message: string;
  note: string;
  dateBuy: string;
  datePost: string;
  status: boolean;
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [notes, setNotes] = useState<number[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await commentsService.getCommentsRating(product._id);
        setNotes(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
      }
    };
    loadComments();
  }, [product._id]);

  const calculateAverageRating = () => {
    if (notes.length === 0) return 0;
    const sum = notes.reduce((acc, note) => acc + note, 0);
    return Math.round(sum / notes.length);
  };

  const averageRating = calculateAverageRating();

  return (
    <Link href={`/shop/product/${product._id}`} className="group block w-full overflow-hidden p-2 h-full">
      <div
        className={`flex h-full ${viewMode === 'horizontal' ? 'flex-row gap-x-6 gap-y-8 min-h-[300px]' : 'flex-col'}`}
      >
        <div
          className={`relative ${viewMode === 'horizontal' ? 'w-full sm:col-span-4 lg:col-span-5' : 'w-full'} ${viewMode === 'horizontal' ? 'aspect-2/3' : 'aspect-square'} overflow-hidden bg-gray-100`}
        >
          <Image
            src={product.imgCollection[0] || '/images/placeholder.png'}
            alt={product.titleProduct}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />

          {/* Badges pour promotion et nouveauté */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.promotionProduct && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-400 text-white">
                {product.oldPriceProduct && product.oldPriceProduct > product.priceProduct
                  ? `PROMO -${Math.round(((product.oldPriceProduct - product.priceProduct) / product.oldPriceProduct) * 100)}%`
                  : 'PROMO'}
              </span>
            )}
            {product.novelty && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-400 text-white">
                NOUVEAU
              </span>
            )}
          </div>
        </div>
        <div
          className={`${viewMode === 'horizontal' ? 'w-full sm:col-span-8 lg:col-span-7' : 'mt-4'} space-y-6`}
        >
          <div className="space-y-4">
            {product.categoryProduct && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.categoryProduct}
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {product.titleProduct}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-lg text-gray-900 dark:text-white">
                {product.priceProduct.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
                {product.oldPriceProduct && product.oldPriceProduct > product.priceProduct && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {product.oldPriceProduct.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                )}
              </p>
              {/* Reviews */}
              {averageRating > 0 && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-xs font-medium text-gray-500">
                    ({averageRating} avis)
                  </span>
                </div>
              )}
            </div>
          </div>

          {viewMode === 'horizontal' && (
            <div className="space-y-8">
              {/* Colors */}
              {product.color && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Couleurs disponibles
                  </h3>
                  <div className="mt-4 flex items-center gap-x-3">
                    {Array.isArray(product.color) && product.color.map((color: string, index: number) => (
                      <ColorCircle
                        key={index}
                        color={color}
                        isSelected={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {product.sizeProduct && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Tailles disponibles
                  </h3>
                  <div className="mt-4 flex items-center gap-x-3">
                    {product.sizeProduct.split(',').map((size: string, index: number) => (
                      <span key={index} className="text-lg text-gray-500 border border-gray-300 rounded-md p-2 min-w-10 text-center">
                        {size.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 max-w-[200px] px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  data-testid="wishlist-button"
                  onClick={e => {
                    e.preventDefault();
                    // TODO: Implémenter la wishlist
                  }}
                >
                  <Heart className="h-5 w-5" />
                  Ajouter aux favoris
                </button>
                <button
                  className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 max-w-[200px] px-4 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  data-testid="cart-button"
                  onClick={e => {
                    e.preventDefault();
                    // TODO: Implémenter l'ajout au panier
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter au panier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
