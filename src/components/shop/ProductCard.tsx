import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/services/api/productService';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'portrait' | 'square';
}

export default function ProductCard({ product, aspectRatio = 'portrait' }: ProductCardProps) {
  return (
    <Link href={`/shop/product/${product._id}`} className="group block w-full">
      <div className="flex flex-col w-full">
        <div
          className={`relative w-full ${aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden rounded-lg bg-gray-100`}
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
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                {product.oldPriceProduct && product.oldPriceProduct > product.priceProduct 
                  ? `PROMO -${Math.round(((product.oldPriceProduct - product.priceProduct) / product.oldPriceProduct) * 100)}%`
                  : 'PROMO'}
              </span>
            )}
            {product.novelty && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500 text-white">
                NOUVEAU
              </span>
            )}
          </div>
          
        </div>
        <div className="mt-4 space-y-1">
          {product.categoryProduct && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.categoryProduct}
            </span>
          )}
          <h3 className="text-sm font-medium leading-none text-gray-900 dark:text-white">
            {product.titleProduct}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.priceProduct.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
            {product.oldPriceProduct && product.oldPriceProduct > product.priceProduct && (
              <p className="text-xs text-gray-500 line-through">
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
