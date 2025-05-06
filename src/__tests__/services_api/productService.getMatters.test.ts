import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockMatters } from '../mocks/apiMocks';
// import { ENV } from '../mocks/envMock';

// Mock axios
vi.mock('axios');

describe('productService.getMatters', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('récupère toutes les matières', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockMatters });

    // Appel de la fonction
    const result = await productService.getMatters();

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop/matters`);
    expect(result).toEqual(mockMatters);
    expect(result.length).toBe(4);
  });

  test('gère les erreurs lors de la récupération des matières', async () => {
    // Mock de console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock d'une erreur
    const mockError = new Error('Erreur matières');
    (axios.get as any).mockRejectedValueOnce(mockError);

    // Vérification que l'erreur est bien propagée
    await expect(productService.getMatters()).rejects.toThrow(mockError);
    
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
}); 