import { Product, Category, Matter, Color } from '@/services/api/productService';

// Mock de données produits pour les tests
export const mockProducts: Product[] = [
  {
    _id: 'prod_001',
    imgCollection: ['/images/products/prod1_1.jpg', '/images/products/prod1_2.jpg'],
    titleProduct: 'Robe d\'été fleuri',
    categoryProduct: 'Robes',
    descriptionProduct: 'Une magnifique robe d\'été avec motif floral',
    priceProduct: 79.99,
    sizeProduct: 'M',
    weightProduct: '200g',
    quantityProduct: 15,
    stockProduct: true,
    promotionProduct: true,
    tags: 'robe,été,floral',
    matter: 'Coton',
    composition: '100% coton',
    fabrication: 'Made in France',
    color: 'Rouge',
    entretien: 'Lavage à 30°',
    novelty: true,
    oldPriceProduct: 99.99,
    yearCollection: 2023,
    visible: true,
    notes: 4.5,
    comments: [],
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-06-20T14:15:00Z'
  },
  {
    _id: 'prod_002',
    imgCollection: ['/images/products/prod2_1.jpg', '/images/products/prod2_2.jpg'],
    titleProduct: 'Jean slim délavé',
    categoryProduct: 'Pantalons',
    descriptionProduct: 'Jean slim avec effet délavé, confortable et tendance',
    priceProduct: 59.99,
    sizeProduct: 'L',
    weightProduct: '450g',
    quantityProduct: 8,
    stockProduct: true,
    promotionProduct: false,
    tags: 'jean,denim,slim',
    matter: 'Denim',
    composition: '98% coton, 2% élasthanne',
    fabrication: 'Made in Italy',
    color: 'Bleu',
    entretien: 'Lavage à 40°',
    novelty: false,
    yearCollection: 2023,
    visible: true,
    notes: 4.2,
    comments: [],
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-05-12T11:30:00Z'
  },
  {
    _id: 'prod_003',
    imgCollection: ['/images/products/prod3_1.jpg'],
    titleProduct: 'T-shirt graphique',
    categoryProduct: 'T-shirts',
    descriptionProduct: 'T-shirt avec design graphique original',
    priceProduct: 29.99,
    sizeProduct: 'S',
    weightProduct: '150g',
    quantityProduct: 25,
    stockProduct: true,
    promotionProduct: true,
    tags: 't-shirt,graphique,design',
    matter: 'Jersey',
    composition: '100% coton bio',
    fabrication: 'Made in Portugal',
    color: 'Noir',
    entretien: 'Lavage à 30°',
    novelty: true,
    oldPriceProduct: 39.99,
    yearCollection: 2023,
    visible: true,
    notes: 4.7,
    comments: [],
    createdAt: '2023-05-20T15:20:00Z',
    updatedAt: '2023-06-18T16:40:00Z'
  }
];

// Mock de données catégories
export const mockCategories: Category[] = [
  { id: 'cat_001', name: 'Robes' },
  { id: 'cat_002', name: 'Pantalons' },
  { id: 'cat_003', name: 'T-shirts' },
  { id: 'cat_004', name: 'Vestes' },
  { id: 'cat_005', name: 'Accessoires' }
];

// Mock de données matières
export const mockMatters: Matter[] = [
  { id: 'mat_001', name: 'Coton' },
  { id: 'mat_002', name: 'Denim' },
  { id: 'mat_003', name: 'Soie' },
  { id: 'mat_004', name: 'Lin' },
  { id: 'mat_005', name: 'Jersey' }
];

// Mock de données couleurs
export const mockColors: Color[] = [
  { id: 'col_001', name: 'Rouge' },
  { id: 'col_002', name: 'Bleu' },
  { id: 'col_003', name: 'Noir' },
  { id: 'col_004', name: 'Blanc' },
  { id: 'col_005', name: 'Vert' }
];

// Mock d'un produit simple pour les tests des composants
export const mockSimpleProduct: Product = {
  _id: 'prod_simple',
  imgCollection: ['/images/placeholder.png'],
  titleProduct: 'Produit Test',
  categoryProduct: 'Catégorie Test',
  priceProduct: 49.99,
  promotionProduct: true,
  oldPriceProduct: 69.99,
  novelty: true,
  color: 'Rouge',
  matter: 'Coton',
  stockProduct: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};

// Mock pour les filtres de produits
export const mockProductFilters = {
  category: 'Robes',
  minPrice: '20',
  maxPrice: '100',
  sort: 'price',
  order: 'asc',
  search: 'robe',
  page: 1,
  limit: 12,
  promotion: true,
  novelty: false,
  matter: 'Coton',
  color: 'Rouge'
}; 