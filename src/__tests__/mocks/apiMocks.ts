import { vi } from 'vitest';
import axios from 'axios';
import { mockProducts, mockCategories, mockMatters, mockColors } from './productMocks';

/**
 * Configure les mocks pour les appels API avec axios
 */
export const setupApiMocks = () => {
  // Reset tous les mocks
  vi.resetAllMocks();
  
  // Mock pour axios.get
  vi.mocked(axios.get).mockImplementation((url: string) => {
    // Appel pour récupérer tous les produits
    if (url.includes('/shop?')) {
      return Promise.resolve({
        data: mockProducts
      });
    }
    
    // Appel pour récupérer un produit par ID
    if (url.match(/\/shop\/[a-zA-Z0-9]+$/)) {
      const productId = url.split('/').pop();
      const product = mockProducts.find(p => p._id === productId);
      
      if (product) {
        return Promise.resolve({ data: product });
      } else {
        return Promise.reject(new Error('Produit non trouvé'));
      }
    }
    
    // Appel pour récupérer les catégories
    if (url.includes('/shop/categories')) {
      return Promise.resolve({
        data: mockCategories
      });
    }
    
    // Appel pour récupérer les matières
    if (url.includes('/shop/matters')) {
      return Promise.resolve({
        data: mockMatters
      });
    }
    
    // Appel pour récupérer les couleurs
    if (url.includes('/shop/colors')) {
      return Promise.resolve({
        data: mockColors
      });
    }
    
    // Appel pour récupérer les produits en promotion
    if (url.includes('/products') && url.includes('isPromotion=true')) {
      return Promise.resolve({
        data: mockProducts.filter(p => p.promotionProduct)
      });
    }
    
    // Appel pour récupérer les nouveaux produits
    if (url.includes('/products') && url.includes('isNew=true')) {
      return Promise.resolve({
        data: mockProducts.filter(p => p.novelty)
      });
    }
    
    // Appel pour rechercher des produits
    if (url.includes('/products/search')) {
      const query = new URL(url).searchParams.get('q') || '';
      return Promise.resolve({
        data: mockProducts.filter(p => 
          p.titleProduct.toLowerCase().includes(query.toLowerCase()) || 
          (p.descriptionProduct && p.descriptionProduct.toLowerCase().includes(query.toLowerCase())) ||
          (p.tags && p.tags.toLowerCase().includes(query.toLowerCase()))
        )
      });
    }
    
    // Réponse par défaut
    return Promise.resolve({ data: {} });
  });
  
  // Mock pour axios.post
  vi.mocked(axios.post).mockImplementation(() => {
    return Promise.resolve({ data: { success: true } });
  });
  
  // Mock pour axios.put
  vi.mocked(axios.put).mockImplementation(() => {
    return Promise.resolve({ data: { success: true } });
  });
  
  // Mock pour axios.delete
  vi.mocked(axios.delete).mockImplementation(() => {
    return Promise.resolve({ data: { success: true } });
  });
};

/**
 * Simule une erreur réseau pour un endpoint spécifique
 * @param endpoint L'URL de l'endpoint qui doit échouer
 * @param errorMessage Le message d'erreur à retourner
 */
export const mockApiError = (endpoint: string, errorMessage: string = 'Erreur de réseau') => {
  vi.mocked(axios.get).mockImplementation((url: string) => {
    if (url.includes(endpoint)) {
      return Promise.reject(new Error(errorMessage));
    }
    
    // Pour les autres endpoints, retourner une promesse résolue simple
    return Promise.resolve({ data: {} });
  });
}; 