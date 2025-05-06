import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { productService } from '@/services/api/productService';
import { mockColors } from '../mocks/apiMocks';
// import { ENV } from '../mocks/envMock';

// Mock axios
vi.mock('axios');

describe('productService.getColors', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('récupère toutes les couleurs', async () => {
    // Configure mock axios
    (axios.get as any).mockResolvedValueOnce({ data: mockColors });

    // Appel de la fonction
    const result = await productService.getColors();

    // Vérifications
    expect(axios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/shop/colors`);
    expect(result).toEqual(mockColors);
    expect(result.length).toBe(4);
  });

  test('gère les erreurs lors de la récupération des couleurs', async () => {
    // Mock de console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock d'une erreur
    const mockError = new Error('Erreur couleurs');
    (axios.get as any).mockRejectedValueOnce(mockError);

    // Vérification que l'erreur est bien propagée
    await expect(productService.getColors()).rejects.toThrow(mockError);
    
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
}); 