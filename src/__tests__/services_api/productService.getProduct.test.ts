import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockProducts } from '../mocks/apiMocks';
// import { ENV } from '../mocks/envMock';

// Mock axios
vi.mock('axios');

describe('productService.getProductById', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('récupère un produit par son ID', async () => {
    const mockProduct = mockProducts.simpleProducts.products[0];
    
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockProduct });

    // Appel de la fonction
    const result = await productService.getProductById('1');

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop/1`);
    expect(result).toEqual(mockProduct);
  });

  test('gère les erreurs lors de la récupération d\'un produit', async () => {
    // Mock de console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock d'une erreur
    const mockError = new Error('Produit non trouvé');
    (axios.get as any).mockRejectedValueOnce(mockError);

    // Vérification que l'erreur est bien propagée
    await expect(productService.getProductById('999')).rejects.toThrow(mockError);
    
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop/999`);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
}); 