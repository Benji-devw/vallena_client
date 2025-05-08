import Link from 'next/link';
import React from 'react';

interface BreadcrumbsProps {
  currentCategoryName?: string | null;
}

export default function Breadcrumbs({ currentCategoryName }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm font-bold" data-testid="shop-breadcrumbs-nav">
      <ol className="flex items-center space-x-1 text-gray-500 dark:text-gray-400" data-testid="shop-breadcrumbs-list">
        <li>
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Accueil
          </Link>
        </li>
        <li>
          <span className="mx-1">/</span>
        </li>
        <li>
          <Link href="/shop" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Shop
          </Link>
        </li>
        {currentCategoryName && (
          <>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li aria-current="page" className="">
              {currentCategoryName}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
} 