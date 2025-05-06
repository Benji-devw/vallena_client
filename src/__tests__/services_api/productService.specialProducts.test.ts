import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockProducts } from '../mocks/apiMocks';
// import { ENV } from '../mocks/envMock';

// Mock axios
vi.mock('axios');

describe('productService special methods', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPromotionalProducts', () => {
    test('récupère les produits en promotion', async () => {
      // Configure mock axios
      (axios.get as any).mockResolvedValueOnce({ data: mockProducts.promotionProducts.products });

      // Appel de la fonction
      const result = await productService.getPromotionalProducts();

      // Vérifications
      expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        params: { isPromotion: true }
      });
      expect(result).toEqual(mockProducts.promotionProducts.products);
    });
  });

  describe('getNewProducts', () => {
    test('récupère les nouveaux produits', async () => {
      // Configure mock axios
      (axios.get as any).mockResolvedValueOnce({ data: mockProducts.noveltyProducts.products });

      // Appel de la fonction
      const result = await productService.getNewProducts();

      // Vérifications
      expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        params: { isNew: true }
      });
      expect(result).toEqual(mockProducts.noveltyProducts.products);
    });
  });

  describe('searchProducts', () => {
    test('recherche des produits par mot-clé', async () => {
      // Configure mock axios
      (axios.get as any).mockResolvedValueOnce({ data: [mockProducts.simpleProducts.products[0]] });

      // Appel de la fonction
      const result = await productService.searchProducts('Produit 1');

      // Vérifications
      expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        params: { q: 'Produit 1' }
      });
      expect(result).toEqual([mockProducts.simpleProducts.products[0]]);
    });

    test('retourne un tableau vide si aucun produit ne correspond', async () => {
      // Configure mock axios pour renvoyer un tableau vide
      (axios.get as any).mockResolvedValueOnce({ data: [] });

      // Appel de la fonction
      const result = await productService.searchProducts('produit inexistant');

      // Vérifications
      expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        params: { q: 'produit inexistant' }
      });
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
}); 