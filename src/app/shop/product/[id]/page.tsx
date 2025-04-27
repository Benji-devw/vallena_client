'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productService } from '@/services/api/productService';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import TabsProductView from '@/components/shop/TabsProductView';

export default function ProductPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id as string);
        setProduct(data.data);
        // Sélectionner la première couleur par défaut
        if (data.data.color) {
          const firstColor = data.data.color.split(',')[0].trim();
          setSelectedColor(firstColor);
        }
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || 'Produit non trouvé'}</p>
      </div>
    );
  }

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // console.log("🔴 product", selectedColor);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery of images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.imgCollection[selectedImage] || '/images/placeholder.png'}
                alt={product.titleProduct}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-cover"
              />
            </div>
            {/* Thumbnails */}
            {product.imgCollection.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imgCollection.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-md ${
                      selectedImage === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.titleProduct} - Vue ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product informations */}
          <div className="space-y-6">
            {product.categoryProduct && (
              <p className="text-sm text-gray-500">{product.categoryProduct}</p>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.titleProduct}
            </h1>
            <p className="text-2xl font-semibold text-primary-600">
              {product.priceProduct.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>

            {product.descriptionProduct && (
              <div className="prose prose-sm dark:prose-invert">
                <p>{product.descriptionProduct}</p>
              </div>
            )}

            {/* Product characteristics */}
            <div className="border-t border-gray-200 pt-6">
              <dl className="space-y-4">
                {product.matter && (
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">Matière</dt>
                    <dd className="mt-1 text-gray-500">{product.matter}</dd>
                  </div>
                )}
                {product.composition && (
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">Composition</dt>
                    <dd className="mt-1 text-gray-500">{product.composition}</dd>
                  </div>
                )}
                {product.entretien && (
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">Entretien</dt>
                    <dd className="mt-1 text-gray-500">{product.entretien}</dd>
                  </div>
                )}
                {product.color && (
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">Couleurs disponibles</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {product.color.split(',').map((color: string, index: number) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full cursor-pointer shadow-sm dark:hover:ring-2 dark:hover:ring-primary-600 ${
                            selectedColor === color.trim() ? 'border-4 dark:border-gray-900 ring-2 ring-primary-600' : ''
                          } ${
                            color.trim().toLowerCase() === 'bleu' ? 'bg-blue-500' :
                            color.trim().toLowerCase() === 'rouge' ? 'bg-red-500' :
                            color.trim().toLowerCase() === 'vert' ? 'bg-green-500' :
                            color.trim().toLowerCase() === 'jaune' ? 'bg-yellow-500' :
                            color.trim().toLowerCase() === 'noir' ? 'bg-black' :
                            color.trim().toLowerCase() === 'blanc' ? 'bg-white border border-gray-300' :
                            color.trim().toLowerCase() === 'gris' ? 'bg-gray-500' :
                            color.trim().toLowerCase() === 'rose' ? 'bg-pink-500' :
                            color.trim().toLowerCase() === 'orange' ? 'bg-orange-500' :
                            color.trim().toLowerCase() === 'marron' ? 'bg-amber-800' :
                            color.trim().toLowerCase() === 'violet' ? 'bg-purple-500' :
                            color.trim().toLowerCase() === 'beige' ? 'bg-amber-100' :
                            'bg-gray-200'
                          }`}
                          title={color.trim()}
                          onClick={() => handleColorChange(color.trim())}
                        />
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Selector of quantity and add to cart button */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span>Ajouter au panier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product description tabs */}
      <TabsProductView product={product} />
    </>
  );
}
