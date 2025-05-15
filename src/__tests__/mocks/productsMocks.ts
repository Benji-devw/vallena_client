import { ProductTypes, CategoryTypes, MatterTypes, ColorTypes } from '@/types/productTypes';

export const mockProducts: ProductTypes[] = [
  {
    _id: '1', 
    imgCollection: ['/images/placeholder.png'],
    titleProduct: 'Robe d\'été légère',
    descriptionProduct: 'Robe légère et confortable parfaite pour les journées ensoleillées',
    priceProduct: 49.99,
    categoryProduct: 'robes',
    matter: 'coton',
    color: 'bleu',
    stockProduct: true,
    quantityProduct: 15,
    promotionProduct: false,
    oldPriceProduct: undefined,
    notes: 4.5,
    comments: ['111'],
    tags: 'robe, été, léger',
    composition: '100% coton',
    fabrication: 'Fabriqué en France',
    entretien: 'Lavage en machine à 30°',
    visible: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-04-20').toISOString()
  },
  {
    _id: '2',
    imgCollection: ['/images/placeholder.png'],
    titleProduct: 'Chemise en lin élégante',
    descriptionProduct: 'Chemise respirante en lin pour un style décontracté mais raffiné',
    priceProduct: 59.99,
    categoryProduct: 'chemises',
    matter: 'lin',
    color: 'blanc',
    stockProduct: true,
    quantityProduct: 8,
    promotionProduct: false,
    notes: 4.2,
    comments: [],
    tags: 'chemise, lin, élégant',
    composition: '100% lin',
    fabrication: 'Fabriqué en Italie',
    entretien: 'Repassage à basse température recommandé',
    visible: true,
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-05-05').toISOString()
  }
];

export const mockProductCategories: CategoryTypes[] = [
  { id: 'robes', name: 'Robes' },
  { id: 'chemises', name: 'Chemises' },
];

export const mockProductMatters: MatterTypes[] = [
  { id: 'coton', name: 'Coton' },
  { id: 'lin', name: 'Lin' },
];

export const mockProductColors: ColorTypes[] = [
  { id: 'noir', name: 'Noir' },
  { id: 'blanc', name: 'Blanc' },
];