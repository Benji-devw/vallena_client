interface SkeletonProps {
  display?: 'column' | 'row';
  rows?: number;
  columns?: number;
  className?: string;
  viewMode?: 'grid' | 'horizontal';
}

export default function Skeleton({
  display = 'column',
  columns = 4,
  rows = 12,
  className,
  viewMode = 'grid',
}: SkeletonProps) {
  if (display === 'row') {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[...Array(columns)].map((_, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {[...Array(columns)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Mode column (grid) par défaut
  const gridLayoutClass =
    viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col';
  return (
    <div
      className={`${gridLayoutClass} ${className || ''} gap-0 border-t border-l border-gray-200 dark:border-gray-700`}
      data-testid="product-skeleton"
    >
      {[...Array(columns)].map((_, index) => (
        <div
          key={index}
          className="border-r border-b border-gray-200 dark:border-gray-700"
          data-testid={`skeleton-cell-${index}`}
        >
          <div className="block w-full overflow-hidden p-2 h-full bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
            {[...Array(rows)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-col justify-start space-y-3 mt-4">
                <div className="h-6 mt-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
