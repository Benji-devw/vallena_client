'use client';

import { useRouter } from 'next/navigation';

export default function ShopNavigation() {
  const router = useRouter();

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Découvrez nos collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="relative group cursor-pointer overflow-hidden rounded-xl"
            data-testid="home-navigation-promotions"
            onClick={() => router.push('/shop?sort=promotions')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 h-64 flex flex-col justify-center items-center text-white">
              <h3 className="text-3xl font-bold mb-4">Promotions</h3>
              <p className="text-lg text-center">Profitez de nos offres exceptionnelles</p>
              <button className="mt-6 px-6 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-colors">
                Voir les promotions
              </button>
            </div>
          </div>

          <div 
            className="relative group cursor-pointer overflow-hidden rounded-xl"
            data-testid="home-navigation-novelty"
            onClick={() => router.push('/shop?sort=novelty')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 h-64 flex flex-col justify-center items-center text-white">
              <h3 className="text-3xl font-bold mb-4">Nouveautés</h3>
              <p className="text-lg text-center">Découvrez nos dernières créations</p>
              <button className="mt-6 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors">
                Voir les nouveautés
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 