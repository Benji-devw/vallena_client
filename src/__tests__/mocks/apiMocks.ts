import { Product, Category, Matter, Color } from '@/services/api/productService';

/**
 * Fonction utilitaire pour créer un mock de produit
 */
export const createMockProduct = (id: string, title: string, price: number, options: Partial<Product> = {}): Product => {
  return {
    _id: id,
    titleProduct: title,
    priceProduct: price,
    imgCollection: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...options
  };
};

/**
 * Collection de produits mockés pour les tests
 */
export const mockProducts = {
  simpleProducts: {
    products: [
      createMockProduct('1', 'Produit 1', 100),
      createMockProduct('2', 'Produit 2', 200),
    ],
    total: 2,
  },
  categoryProducts: {
    products: [
      createMockProduct('3', 'Robe A', 100, { categoryProduct: 'robes' }),
      createMockProduct('4', 'Robe B', 120, { categoryProduct: 'robes' }),
    ],
    total: 2,
  },
  shirtProducts: {
    products: [
      createMockProduct('5', 'Chemise', 80, { categoryProduct: 'chemises' }),
      createMockProduct('6', 'Chemisier', 95, { categoryProduct: 'chemises' }),
    ],
    total: 2,
  },
  paginatedProducts: {
    products: [
      createMockProduct('7', 'Produit 7', 250),
      createMockProduct('8', 'Produit 8', 300),
    ],
    total: 10,
  },
  promotionProducts: {
    products: [
      createMockProduct('9', 'Produit en promo', 80, { 
        promotionProduct: true, 
        oldPriceProduct: 120,
      }),
      createMockProduct('10', 'Autre promo', 150, { 
        promotionProduct: true, 
        oldPriceProduct: 200,
      }),
    ],
    total: 2,
  },
  noveltyProducts: {
    products: [
      createMockProduct('11', 'Nouvelle collection', 99, { novelty: true }),
      createMockProduct('12', 'Dernière tendance', 129, { novelty: true }),
    ],
    total: 2,
  },
  colorProducts: {
    products: [
      createMockProduct('13', 'T-shirt noir', 49.99, { color: 'noir' }),
      createMockProduct('14', 'T-shirt blanc', 49.99, { color: 'blanc' }),
    ],
    total: 2,
  },
  matterProducts: {
    products: [
      createMockProduct('15', 'Robe soie', 159.99, { matter: 'soie' }),
      createMockProduct('16', 'Robe coton', 79.99, { matter: 'coton' }),
    ],
    total: 2,
  }
};

/**
 * Collection de filtres mockés pour les tests
 */
export const mockFilters = {
  completeFilters: {
    category: 'robes',
    minPrice: '50',
    maxPrice: '150',
    sort: 'price',
    order: 'asc',
    search: 'robe',
    page: 1,
    limit: 10,
    matter: 'coton',
    color: 'noir',
  },
  categoryAndPriceFilters: {
    category: 'chemises',
    minPrice: '75',
  },
  paginationFilters: {
    page: 2,
    limit: 2,
  },
  promotionFilters: {
    promotion: true,
  },
  noveltyFilters: {
    novelty: true,
  },
  colorFilters: {
    color: 'noir',
  },
  matterFilters: {
    matter: 'coton',
  }
};

/**
 * Mocks pour les catégories
 */
export const mockCategories: Category[] = [
  { id: 'robes', name: 'Robes' },
  { id: 'chemises', name: 'Chemises' },
  { id: 'pantalons', name: 'Pantalons' },
  { id: 'accessoires', name: 'Accessoires' },
];

/**
 * Mocks pour les matières
 */
export const mockMatters: Matter[] = [
  { id: 'coton', name: 'Coton' },
  { id: 'soie', name: 'Soie' },
  { id: 'lin', name: 'Lin' },
  { id: 'laine', name: 'Laine' },
];

/**
 * Mocks pour les couleurs
 */
export const mockColors: Color[] = [
  { id: 'noir', name: 'Noir' },
  { id: 'blanc', name: 'Blanc' },
  { id: 'rouge', name: 'Rouge' },
  { id: 'bleu', name: 'Bleu' },
]; 