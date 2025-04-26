import { useState } from 'react';
import { Product } from '@/services/api/productService';

interface TabsProductViewProps {
  product: Product;
}

export default function TabsProductView({ product }: TabsProductViewProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Détails' },
    { id: 'reviews', label: 'Avis' },
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
        {/* Tabs navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="mt-8">
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
              <p className="text-gray-500">Les avis seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 