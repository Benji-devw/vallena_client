import { render, screen, within } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { Product } from '@/services/api/productService';

/**
 * Vérifie si un produit est correctement affiché dans l'interface
 * @param product Données du produit à vérifier
 */
export const expectProductToBeDisplayed = (product: Product) => {
  // Vérifier que le titre du produit est affiché
  expect(screen.getByText(product.titleProduct)).toBeInTheDocument();
  
  // Vérifier que le prix est affiché (avec une recherche plus flexible)
  // Créer une regex qui recherche le prix en ignorant le formatage exact
  const priceRegex = new RegExp(product.priceProduct.toString().replace('.', '[.,]'), 'i');
  expect(screen.getByText(priceRegex)).toBeInTheDocument();
  
  // Vérifier l'affichage de la catégorie si présente
  if (product.categoryProduct) {
    expect(screen.getByText(product.categoryProduct)).toBeInTheDocument();
  }
  
  // Vérifier l'affichage du badge promotion si le produit est en promotion
  if (product.promotionProduct) {
    expect(screen.getByText(/PROMO/i)).toBeInTheDocument();
    
    // Vérifier que l'ancien prix est affiché avec une ligne barrée
    if (product.oldPriceProduct) {
      // Utiliser une regex pour l'ancien prix également
      const oldPriceRegex = new RegExp(product.oldPriceProduct.toString().replace('.', '[.,]'), 'i');
      const oldPriceElements = screen.getAllByText(oldPriceRegex);
      
      // Au moins un des éléments doit avoir la classe line-through
      const hasLineThrough = oldPriceElements.some(element => 
        element.className.includes('line-through')
      );
      expect(hasLineThrough).toBe(true);
    }
  }
  
  // Vérifier l'affichage du badge nouveauté si le produit est nouveau
  if (product.novelty) {
    expect(screen.getByText(/NOUVEAU/i)).toBeInTheDocument();
  }
};

/**
 * Génère des données de produit aléatoires pour les tests
 * @param overrides Valeurs à remplacer dans le produit généré
 */
export const generateMockProduct = (overrides: Partial<Product> = {}): Product => {
  const productId = `prod_${Math.floor(Math.random() * 10000)}`;
  
  return {
    _id: productId,
    imgCollection: ['/images/placeholder.png'],
    titleProduct: `Produit Test ${productId}`,
    categoryProduct: 'Catégorie Test',
    descriptionProduct: 'Description du produit de test',
    priceProduct: Math.floor(Math.random() * 200) + 19.99,
    stockProduct: true,
    promotionProduct: Math.random() > 0.5,
    novelty: Math.random() > 0.5,
    oldPriceProduct: Math.floor(Math.random() * 300) + 59.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

/**
 * Retoure une function de rendu customisée avec des éléments réutilisables
 * Utilisé pour les tests de composants
 */
export const customRender = (ui: React.ReactElement, options = {}) => {
  return {
    ...render(ui, options),
    // Extension de screen
    screen,
  };
}; 