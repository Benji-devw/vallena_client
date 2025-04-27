import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockProducts, mockCategories, mockMatters, mockColors, mockProductFilters } from '../../mocks/productMocks';
import { setupApiMocks, mockApiError } from '../../mocks/apiMocks';

// Mock pour axios
vi.mock('axios');

describe('productService', () => {
  beforeEach(() => {
    setupApiMocks();
  });

  describe('getAllProducts', () => {
    it('récupère tous les produits correctement', async () => {
      // Configurer le mock pour retourner des données de test
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockProducts });
      
      // Appeler la fonction à tester
      const result = await productService.getAllProducts();
      
      // Vérifier que la fonction renvoie les données correctes
      expect(result).toEqual(mockProducts);
      
      // Vérifier que axios.get a été appelé avec les bons paramètres
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8800/api/shop?');
    });

    it('ajoute les paramètres de filtre corrects à l\'URL', async () => {
      // Utiliser les filtres de test
      vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
      
      // Appeler la fonction avec les filtres
      await productService.getAllProducts(mockProductFilters);
      
      // Vérifier que l'URL contient les bons paramètres
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`category=${mockProductFilters.category}`)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`minPrice=${mockProductFilters.minPrice}`)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`maxPrice=${mockProductFilters.maxPrice}`)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`page=${mockProductFilters.page}`)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`limit=${mockProductFilters.limit}`)
      );
    });

    it('gère les erreurs correctement', async () => {
      // Simuler une erreur
      const errorMessage = 'Erreur réseau';
      mockApiError('/shop', errorMessage);
      
      // Vérifier que l'erreur est propagée
      await expect(productService.getAllProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProductById', () => {
    it('récupère un produit par son ID', async () => {
      const productId = mockProducts[0]._id;
      const mockProduct = mockProducts[0];
      
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockProduct });
      
      const result = await productService.getProductById(productId);
      
      expect(result).toEqual(mockProduct);
      expect(axios.get).toHaveBeenCalledWith(`http://localhost:8800/api/shop/${productId}`);
    });
  });

  describe('getCategories', () => {
    it('récupère toutes les catégories', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCategories });
      
      const result = await productService.getCategories();
      
      expect(result).toEqual(mockCategories);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8800/api/shop/categories');
    });
  });

  describe('getMatters', () => {
    it('récupère toutes les matières', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockMatters });
      
      const result = await productService.getMatters();
      
      expect(result).toEqual(mockMatters);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8800/api/shop/matters');
    });
  });

  describe('getColors', () => {
    it('récupère toutes les couleurs', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockColors });
      
      const result = await productService.getColors();
      
      expect(result).toEqual(mockColors);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8800/api/shop/colors');
    });
  });
}); 