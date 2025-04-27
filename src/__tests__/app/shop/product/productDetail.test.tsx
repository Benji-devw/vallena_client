import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetailPage from '@/app/shop/product/[id]/page';
import { productService } from '@/services/api/productService';
import { mockProducts } from '../../../mocks/productMocks';
import { setupApiMocks } from '../../../mocks/apiMocks';

// Mock useParams de Next.js pour simuler les paramètres d'URL
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return {
    ...actual,
    useParams: () => ({ id: mockProducts[0]._id }),
    useRouter: () => ({
      ...actual.useRouter(),
      push: vi.fn(),
      replace: vi.fn(),
    }),
  };
});

// Mock pour productService avec la structure correcte attendue par le composant
vi.mock('@/services/api/productService', () => ({
  productService: {
    getProductById: vi.fn(),
  },
}));

describe('Page de détail du produit', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setupApiMocks();
    
    // Mock par défaut pour retourner un produit avec la structure correcte
    // Le composant s'attend à data.data.color, donc on emballe le produit dans un objet data
    (productService.getProductById as any).mockResolvedValue({
      data: mockProducts[0]
    });
  });

  it('affiche correctement les détails du produit', async () => {
    const { container } = render(<ProductDetailPage />);
    
    // Attendre que les données du produit soient chargées avec plus d'options
    await waitFor(
      () => {
        const productTitleElement = screen.queryByText(mockProducts[0].titleProduct);
        expect(productTitleElement).not.toBeNull();
      },
      { timeout: 3000, interval: 100 }
    );
    
    // Vérifier que le titre du produit est affiché
    expect(screen.getByText(mockProducts[0].titleProduct)).toBeInTheDocument();
    
    // Vérifier la présence des sections attendues sans vérifier leur contenu exact
    expect(container.querySelector('.prose')).not.toBeNull(); // Section de description
    
    // Vérifier que le service a été appelé avec le bon ID
    expect(productService.getProductById).toHaveBeenCalledWith(mockProducts[0]._id);
  });

  it('affiche un message d\'erreur lorsque le produit n\'est pas trouvé', async () => {
    // Simuler une erreur lors de la récupération du produit
    (productService.getProductById as any).mockRejectedValue(new Error('Produit non trouvé'));
    
    render(<ProductDetailPage />);
    
    // Attendre que le message d'erreur soit affiché avec plus d'options
    await waitFor(
      () => {
        const errorElement = screen.queryByText(/Erreur/i);
        expect(errorElement).not.toBeNull();
        expect(errorElement).toBeInTheDocument();
      },
      { timeout: 3000, interval: 100 }
    );
  });

  it('affiche le bouton d\'ajout au panier', async () => {
    render(<ProductDetailPage />);
    
    // Attendre que les données du produit soient chargées avec plus d'options
    await waitFor(
      () => {
        const productTitleElement = screen.queryByText(mockProducts[0].titleProduct);
        expect(productTitleElement).not.toBeNull();
        expect(productTitleElement).toBeInTheDocument();
      },
      { timeout: 3000, interval: 100 }
    );
    
    // Vérifier que le bouton "Ajouter au panier" est présent dans le DOM
    const addToCartButton = screen.queryByText(/Ajouter au panier/i);
    expect(addToCartButton).not.toBeNull();
    expect(addToCartButton).toBeInTheDocument();
    
    // Vérifier que le bouton est bien un élément button
    expect(addToCartButton?.tagName.toLowerCase()).toBe('span');
    expect(addToCartButton?.parentElement?.tagName.toLowerCase()).toBe('button');
  });

  it('permet d\'ajouter le produit au panier', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    
    // Mock window.alert
    const alertMock = vi.fn();
    window.alert = alertMock;
    
    // Sauvegarder l'original pour le restaurer après le test
    const originalLocalStorage = window.localStorage;
    
    // Remplacer localStorage par notre mock
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true 
    });
    
    // Configurer le mock pour retourner un panier vide
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    
    render(<ProductDetailPage />);
    
    // Attendre que les données du produit soient chargées avec plus d'options
    await waitFor(
      () => {
        const productTitleElement = screen.queryByText(mockProducts[0].titleProduct);
        expect(productTitleElement).not.toBeNull();
        expect(productTitleElement).toBeInTheDocument();
      },
      { timeout: 3000, interval: 100 }
    );
    
    // Trouver et cliquer sur le bouton "Ajouter au panier"
    const addToCartButton = screen.getByRole('button', { name: /Ajouter au panier/i });
    fireEvent.click(addToCartButton);
    
    // Vérifier que localStorage.setItem a été appelé (ajout au panier)
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem.mock.calls[0][0]).toBe('cart');
    
    // Vérifier que le produit a été ajouté au panier
    const cartData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(cartData).toHaveLength(1);
    expect(cartData[0].productId).toBe(mockProducts[0]._id);
    
    // Vérifier que alert a été appelé avec le bon message
    expect(alertMock).toHaveBeenCalledWith('Produit ajouté au panier !');
    
    // Restaurer localStorage original après le test
    Object.defineProperty(window, 'localStorage', { 
      value: originalLocalStorage,
      writable: true 
    });
  });
}); 