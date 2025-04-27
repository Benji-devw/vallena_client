interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

export default function ProductSkeleton({ count = 6, className = '' }: ProductSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} data-testid="product-skeleton">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse" data-testid={`skeleton-item-${index}`}>
          <div className="aspect-square bg-gray-300 dark:bg-gray-600"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
} 