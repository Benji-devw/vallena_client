import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockProducts, mockFilters } from '../mocks/apiMocks';
// import { ENV } from '../mocks/envMock';

// Mock axios
vi.mock('axios');

describe('productService.getAllProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('récupère tous les produits sans filtres', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.simpleProducts });

    // Appel de la fonction
    const result = await productService.getAllProducts();
    // console.log(result);

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?`);
    expect(result).toEqual(mockProducts.simpleProducts);
  });

  test('récupère les produits avec des filtres complets', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.categoryProducts });

    // Appel de la fonction
    const result = await productService.getAllProducts(mockFilters.completeFilters);

    // Construction de l'URL attendue
    const expectedUrl = `${process.env.NEXT_PUBLIC_API_URL}/shop?category=robes&minPrice=50&maxPrice=150&sort=price&order=asc&search=robe&matter=coton&color=noir&page=1&limit=10`;
    
    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockProducts.categoryProducts);
  });

  test('récupère les produits avec seulement la catégorie et le prix minimum', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.shirtProducts });

    // Appel de la fonction
    const result = await productService.getAllProducts(mockFilters.categoryAndPriceFilters);

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?category=chemises&minPrice=75`);
    expect(result).toEqual(mockProducts.shirtProducts);
  });

  test('récupère les produits avec pagination uniquement', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.paginatedProducts });

    // Appel de la fonction
    const result = await productService.getAllProducts(mockFilters.paginationFilters);

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?page=2&limit=2`);
    expect(result).toEqual(mockProducts.paginatedProducts);
  });

  test('récupère les produits en promotion', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.promotionProducts });

    // Appel de la fonction avec filtres de promotion
    const result = await productService.getAllProducts(mockFilters.promotionFilters);

    // Vérifications - Notez que "promotion" n'est pas inclus dans l'URL car il est géré par le composant SortBy
    // selon le commentaire dans le code source de getAllProducts
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?`);
    expect(result).toEqual(mockProducts.promotionProducts);
    expect(result.products[0].promotionProduct).toBe(true);
    expect(result.products[0].oldPriceProduct).toBeDefined();
  });

  test('récupère les produits nouveautés', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.noveltyProducts });

    // Appel de la fonction avec filtres de nouveauté
    const result = await productService.getAllProducts(mockFilters.noveltyFilters);

    // Vérifications - Notez que "novelty" n'est pas inclus dans l'URL car il est géré par le composant SortBy
    // selon le commentaire dans le code source de getAllProducts
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?`);
    expect(result).toEqual(mockProducts.noveltyProducts);
    expect(result.products[0].novelty).toBe(true);
  });

  test('récupère les produits par couleur', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.colorProducts });

    // Appel de la fonction avec filtres de couleur
    const result = await productService.getAllProducts(mockFilters.colorFilters);

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?color=noir`);
    expect(result).toEqual(mockProducts.colorProducts);
  });

  test('récupère les produits par matière', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProducts.matterProducts });

    // Appel de la fonction avec filtres de matière
    const result = await productService.getAllProducts(mockFilters.matterFilters);

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?matter=coton`);
    expect(result).toEqual(mockProducts.matterProducts);
  });

  test('gère les erreurs correctement', async () => {
    // Mock de console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock d'une erreur
    const mockError = new Error('Erreur de réseau');
    (axios.get as any).mockRejectedValueOnce(mockError);

    // Vérification que l'erreur est bien propagée
    await expect(productService.getAllProducts()).rejects.toThrow(mockError);
    
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop?`);
    // Vérification que l'erreur est bien loggée dans la console
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
}); 