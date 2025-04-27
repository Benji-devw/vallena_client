import { useState } from 'react';
import { Product } from '@/services/api/productService';
import { FileText, Info, Star } from 'lucide-react';

interface TabsProductViewProps {
  product: Product;
}

export default function TabsProductView({ product }: TabsProductViewProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'details', label: 'Détails', icon: Info },
    { id: 'reviews', label: 'Avis', icon: Star },
  ];

  const productDetails = [
    { id: 'name', label: 'Nom', value: product.titleProduct },
    { 
      id: 'price', 
      label: 'Prix', 
      value: `${product.priceProduct.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} /unité`
    },
    { id: 'quantity', label: 'Quantité', value: `${product.quantityProduct} en stock` },
    { id: 'category', label: 'Catégories', value: product.categoryProduct },
    { id: 'matter', label: 'Matière', value: product.matter },
    { id: 'color', label: 'Coloris', value: product.color },
    { id: 'size', label: 'Taille', value: product.sizeProduct },
    { id: 'weight', label: 'Poids', value: product.weightProduct },
    { id: 'composition', label: 'Composition', value: product.composition },
    { id: 'fabrication', label: 'Fabrication', value: product.fabrication },
    { id: 'novelty', label: 'Nouveauté', value: product.novelty ? 'Oui' : 'Non' },
    { id: 'promotion', label: 'En promotion', value: product.promotionProduct ? 'Oui' : 'Non' },
    { id: 'collection', label: 'Collection', value: product.yearCollection },
    { id: 'tags', label: 'Mots clé', value: product.tags }
  ];

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs navigation */}
          <div className="lg:w-1/4">
            <nav className="flex flex-col space-y-2" aria-label="Tabs">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group flex items-center space-x-3 whitespace-nowrap py-3 px-4 rounded-lg font-medium text-md
                      transition-all duration-200 ease-in-out
                      ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 ring-2 ring-primary-500/50'
                          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                      }
                    `}
                  >
                    <Icon className={`
                      h-6 w-6 transition-colors
                      ${
                        activeTab === tab.id 
                          ? 'text-primary-600' 
                          : 'text-gray-400 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-300'
                      }
                    `} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab content */}
          <div className="lg:w-3/4">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {product.descriptionProduct ? (
                  <p>{product.descriptionProduct}</p>
                ) : (
                  <p className="text-gray-500 italic">Aucune description disponible</p>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {productDetails.map(detail => (
                      detail.value && (
                        <tr key={detail.id}>
                          <th scope="row" className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                            {detail.label}
                          </th>
                          <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                            {detail.value}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Les avis seront bientôt disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 