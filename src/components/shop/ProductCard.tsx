import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/services/api/productService';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'horizontal';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  return (
    <Link href={`/shop/product/${product._id}`} className="group block w-full overflow-hidden">
      <div
        className={`flex ${viewMode === 'horizontal' ? 'flex-row gap-4 min-h-[400px]' : 'flex-col'}`}
      >
        <div
          className={`relative ${viewMode === 'horizontal' ? 'w-1/3 min-h-[200px]' : 'w-full'} aspect-square overflow-hidden rounded-lg bg-gray-100`}
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
          <div className="absolute top-2 left-2 flex flex-col gap-2">
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
          className={`${viewMode === 'horizontal' ? 'w-2/3 flex flex-col justify-center' : 'mt-4'} space-y-1`}
        >
          <div className="flex items-center justify-between">
            {product.categoryProduct && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.categoryProduct}
              </span>
            )}
            <div className="flex gap-2">
              <button
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                data-testid="wishlist-button"
                onClick={e => {
                  e.preventDefault();
                  // TODO: Implémenter la wishlist
                }}
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                data-testid="cart-button"
                onClick={e => {
                  e.preventDefault();
                  // TODO: Implémenter l'ajout au panier
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold leading-none text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
              {product.titleProduct}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-md font-medium text-gray-900 dark:text-white">
              {product.priceProduct.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            {product.oldPriceProduct && product.oldPriceProduct > product.priceProduct && (
              <p className="text-sm text-gray-500 line-through">
                {product.oldPriceProduct.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
