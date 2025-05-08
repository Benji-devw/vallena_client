import { useEffect, useState } from 'react';
import { Product, productService } from '@/services/api/productService';
import { FileText, Info, Star, ChevronDown } from 'lucide-react';
import { commentsService, Comment } from '@/services/api/commentService';
import CommentCard from './CommentCard';
import SliderProduct from './SliderProduct';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');
  const [comments, setComments] = useState<Comment[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    title: '',
    message: '',
    rating: 5
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    sizeFit: false,
    method: false,
    fabrication: false,
    entretien: false
  });

  const toggleDropdown = (dropdown: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!product?._id) return;
      try {
        const response = await commentsService.getCommentsByProduct(product._id);
        setComments(response.data);
        
        // Calculer la moyenne des notes
        if (response.data.length > 0) {
          const sum = response.data.reduce((acc: number, comment: Comment) => acc + Number(comment.note), 0);
          setAverageRating(Math.round(sum / response.data.length));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
      }
    };
    fetchComments();
  }, [product?._id]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product?._id || !product?.categoryProduct) {
        setSimilarProducts([]);
        return;
      }
      try {
        const fetchedProducts = await productService.getSimilarProducts(
          product._id,
          product.categoryProduct,
          8
        );
        setSimilarProducts(fetchedProducts);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits similaires:', error);
        setSimilarProducts([]);
      }
    };
    fetchSimilarProducts();
  }, [product?._id, product?.categoryProduct]);

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du commentaire
    setShowCommentForm(false);
  };

  return (
    <div className="w-full mt-8 py-2">
      <div className="bg-gray-100 dark:bg-dark-800/60 py-10 md:py-12 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-4 mb-10" aria-label="Tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group flex items-center space-x-3 whitespace-nowrap py-4 px-6 rounded-lg font-medium text-lg
                    transition-all duration-200 ease-in-out transform border
                    ${
                      activeTab === tab.id
                        ? 'border border-primary-500 shadow-lg text-primary-500'
                        : 'text-gray-600 hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-dark-700/70 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                    }
                  `}
                >
                  <Icon className={`
                    h-6 w-6 transition-colors
                    ${
                      activeTab === tab.id 
                        ? 'text-primary-500' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                    }
                  `} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
                {product.descriptionProduct ? (
                  <p dangerouslySetInnerHTML={{ __html: product.descriptionProduct }} />
                ) : (
                  <p className="italic">Aucune description disponible.</p>
                )}

                <div className="mt-8 space-y-6">
                  {/* Dropdown fit and size */}
                  {product.size_fit && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <button
                        onClick={() => toggleDropdown('sizeFit')}
                        className="w-full flex items-center justify-between text-left text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <span>Taille et coupe</span>
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openDropdowns.sizeFit ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <div className={`mt-4 space-y-4 overflow-hidden transition-all duration-200 ${
                        openDropdowns.sizeFit ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                            {Array.isArray(product.size_fit) && product.size_fit.map((fit: string, index: number) => (
                              <li key={index}>{fit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropdown method of fabrication */}
                  {product.method && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <button
                        onClick={() => toggleDropdown('method')}
                        className="w-full flex items-center justify-between text-left text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <span>Méthode de fabrication</span>
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openDropdowns.method ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div className={`mt-4 space-y-4 overflow-hidden transition-all duration-200 ${
                        openDropdowns.method ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                            {Array.isArray(product.method) && product.method.map((method: string, index: number) => (
                              <li key={index}>{method}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="overflow-x-auto p-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                    {productDetails.filter(detail => detail.value != null && detail.value !== '').map(detail => (
                      <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-dark-600/50 transition-colors">
                        <th scope="row" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white w-1/3">
                          {detail.label}
                        </th>
                        <td className="py-3.5 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {typeof detail.value === 'boolean' ? (detail.value ? 'Oui' : 'Non') : detail.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Note globale */}
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= averageRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Basé sur {comments.length} avis
                  </p>
                </div>

                {/* Bouton pour ajouter un avis */}
                {!showCommentForm && (
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => setShowCommentForm(true)}
                      className="btn-primary px-6 py-2.5 rounded-md text-sm font-medium"
                    >
                      Ajouter un avis
                    </button>
                  </div>
                )}

                {/* Formulaire d'ajout d'avis */}
                {showCommentForm && (
                  <form onSubmit={handleSubmitComment} className="bg-white dark:bg-dark-700/50 p-6 rounded-lg shadow-sm space-y-4 max-w-2xl mx-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Note
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewComment(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newComment.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={newComment.title}
                        onChange={(e) => setNewComment(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commentaire
                      </label>
                      <textarea
                        value={newComment.message}
                        onChange={(e) => setNewComment(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowCommentForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Envoyer
                      </button>
                    </div>
                  </form>
                )}

                {/* Liste des commentaires */}
                {comments.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">Aucun avis pour ce produit pour le moment.</p>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <CommentCard key={index} comment={comment} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-16 mb-8">
          <SliderProduct products={similarProducts} title="Dans la même catégorie" />
        </div>
      )}
    </div>
  );
} 