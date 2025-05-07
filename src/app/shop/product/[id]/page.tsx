'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productService } from '@/services/api/productService';
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import ProductTabs from '@/components/shop/ProductTabs';
import ColorCircle from '@/components/ui/ColorCircle';

export default function ProductPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  // Fonction pour ajouter le produit au panier
  const handleAddToCart = () => {
    try {
      // Récupérer le panier actuel (ou initialiser un tableau vide)
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Ajouter le produit au panier
      const productToAdd = {
        productId: product._id,
        title: product.titleProduct,
        price: product.priceProduct,
        quantity: quantity,
        color: selectedColor,
        image: product.imgCollection[0],
      };

      // Vérifier si le produit existe déjà dans le panier
      const existingProductIndex = cart.findIndex(
        (item: any) => item.productId === product._id && item.color === selectedColor
      );

      if (existingProductIndex >= 0) {
        // Mettre à jour la quantité si le produit existe déjà
        cart[existingProductIndex].quantity += quantity;
      } else {
        // Ajouter le nouveau produit au panier
        cart.push(productToAdd);
      }

      // Sauvegarder le panier dans localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Feedback à l'utilisateur (uniquement dans un environnement navigateur)
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert('Produit ajouté au panier !');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      // Uniquement dans un environnement navigateur
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert("Une erreur est survenue lors de l'ajout au panier");
      }
    }
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

            <div className="mt-6">
              <div className="grid grid-cols-2 text-center dark:border-gray-700 rounded-lg overflow-hidden">
                {product.matter && (
                  <div className="p-4 border-r border-b border-gray-200 dark:border-gray-700">
                    <dt className="font-medium text-gray-900 dark:text-white">Matière</dt>
                    <dd className="mt-1 text-gray-500">{product.matter}</dd>
                  </div>
                )}
                {product.composition && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <dt className="font-medium text-gray-900 dark:text-white">Composition</dt>
                    <dd className="mt-1 text-gray-500">{product.composition}</dd>
                  </div>
                )}
                {product.entretien && (
                  <div className="p-4 border-r border-gray-200 dark:border-gray-700">
                    <dt className="font-medium text-gray-900 dark:text-white">Entretien</dt>
                    <dd className="mt-1 text-gray-500">{product.entretien}</dd>
                  </div>
                )}
                {product.weightProduct && (
                  <div className="p-4">
                    <dt className="font-medium text-gray-900 dark:text-white">Poids</dt>
                    <dd className="mt-1 text-gray-500">{product.weightProduct}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Product characteristics */}
            <div className="border-b border-gray-200 pb-6">
              <dl className="space-y-4">
                {product.color && (
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Couleurs disponibles
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {product.color.split(',').map((color: string, index: number) => (
                        <ColorCircle
                          key={index}
                          color={color.trim()}
                          isSelected={selectedColor === color.trim()}
                          onClick={() => handleColorChange(color.trim())}
                        />
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              {product.sizeProduct && (
                <div>
                  <h3 className="mt-4 font-medium text-gray-900 dark:text-white">
                    Tailles disponibles
                  </h3>
                  <div className="mt-4 flex items-center gap-x-3">
                    {product.sizeProduct.split(',').map((size: string, index: number) => (
                      <span
                        key={index}
                        onClick={() => handleSizeChange(size.trim())}
                        className={`text-lg text-gray-500 cursor-pointer border border-gray-300 hover:border-primary-500   rounded-md p-2 min-w-10 text-center ${
                          selectedSize === size.trim() ? 'border-primary-500 text-primary-500' : ''
                        }`}
                      >
                        {size.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Ajouter au panier</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <Heart className="h-5 w-5" />
                  <span>Ajouter à la liste des souhaits</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product description tabs */}
      <ProductTabs product={product} />
    </>
  );
}
