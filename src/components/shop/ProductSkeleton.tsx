interface ProductSkeletonProps {
  count?: number;
  className?: string;
  viewMode?: 'grid' | 'horizontal';
}

export default function ProductSkeleton({ count = 12, className, viewMode = 'grid' }: ProductSkeletonProps) {
  const gridLayoutClass = viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col';
  return (
    <div className={`${gridLayoutClass} ${className || ''} gap-0 border-t border-l border-gray-200 dark:border-gray-700`} data-testid="product-skeleton">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="border-r border-b border-gray-200 dark:border-gray-700" data-testid={`skeleton-cell-${index}`}>
          <div className="block w-full overflow-hidden p-2 h-full bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
            <div className={`flex h-full ${viewMode === 'horizontal' ? 'flex-row gap-x-6 gap-y-8 min-h-[300px]' : 'flex-col'}`}>
              <div className={`relative ${viewMode === 'horizontal' ? 'w-2/5' : 'w-full'} ${viewMode === 'horizontal' ? 'aspect-2/3' : 'aspect-square'} overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-600`}></div>
              <div className={`flex flex-col justify-start space-y-3 ${viewMode === 'horizontal' ? 'w-3/5' : 'mt-4'}`}>
                <div className="h-6 mt-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-6 mt-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-6 mt-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
