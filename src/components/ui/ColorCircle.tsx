interface ColorCircleProps {
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const getColorClass = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    bleu: 'bg-blue-500',
    rouge: 'bg-red-600',
    vert: 'bg-green-600',
    jaune: 'bg-yellow-600',
    noir: 'bg-black',
    blanc: 'bg-white border border-gray-300',
    gris: 'bg-gray-600',
    rose: 'bg-pink-600',
    orange: 'bg-orange-600',
    marron: 'bg-amber-800',
    violet: 'bg-purple-600',
    beige: 'bg-amber-100',
  };

  return colorMap[color.toLowerCase()] || 'bg-gray-200';
};

const getSizeClass = (size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };
  return sizeMap[size];
};

export default function ColorCircle({ color, isSelected = false, onClick, size = 'md' }: ColorCircleProps) {
  return (
    <div
      className={`
        ${getSizeClass(size)} 
        rounded-full 
        cursor-pointer 
        shadow-sm 
        dark:hover:ring-2 
        dark:hover:ring-primary-600
        ${getColorClass(color)}
        ${isSelected ? 'border-4 dark:border-gray-900 ring-2 ring-primary-600' : ''}
      `}
      title={color}
      onClick={onClick}
    />
  );
} 