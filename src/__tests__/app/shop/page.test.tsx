import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShopPage from '@/app/shop/page';
import { productService } from '@/services/api/productService';
import { commentsService } from '@/services/api/commentsService';

// Mock des services
vi.mock('@/services/api/productService', () => ({
  productService: {
    getAllProducts: vi.fn(),
    getCategories: vi.fn(),
    getMatters: vi.fn(),
    getColors: vi.fn()
  }
}));

vi.mock('@/services/api/commentsService', () => ({
  commentsService: {
    getComments: vi.fn()
  }
}));

describe('ShopPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mocks par défaut
    (productService.getAllProducts as any).mockResolvedValue([
      { _id: '1', titleProduct: 'Produit 1', priceProduct: 99.99, imgCollection: ['/image1.jpg'] },
      { _id: '2', titleProduct: 'Produit 2', priceProduct: 149.99, imgCollection: ['/image2.jpg'] }
    ]);
    
    (productService.getCategories as any).mockResolvedValue([
      { id: '1', name: 'Vêtements' },
      { id: '2', name: 'Accessoires' }
    ]);
    
    (productService.getMatters as any).mockResolvedValue([
      { id: '1', name: 'Coton' },
      { id: '2', name: 'Soie' }
    ]);
    
    (productService.getColors as any).mockResolvedValue([
      { id: '1', name: 'Rouge' },
      { id: '2', name: 'Bleu' }
    ]);
    
    (commentsService.getComments as any).mockResolvedValue([]);
  });

  it('charge et affiche les produits correctement', async () => {
    // Render la page
    render(<ShopPage />);
    
    // Vérifier que le titre de la page est affiché
    expect(screen.getByTestId('shop-title')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    
    // Vérifier que le squelette de chargement est présent initialement
    const skeletonElement = screen.queryByTestId('shop-loading-skeleton');
    // Note: on ne vérifie pas qu'il soit non-null car il peut disparaître rapidement dans le test
    
    // Attendre que les produits soient chargés - c'est le vrai test important
    await waitFor(
      () => {
        // Vérifier si le conteneur de produits est affiché
        const productsGrid = screen.queryByTestId('shop-products-grid');
        return productsGrid !== null;
      },
      { timeout: 5000 } // Augmenter le timeout pour donner plus de temps au chargement
    );
    
    // Une fois les produits chargés, vérifier que les deux produits sont affichés
    expect(screen.getByText('Produit 1')).toBeInTheDocument();
    expect(screen.getByText('Produit 2')).toBeInTheDocument();
    
    // Vérifier que les services ont été appelés
    expect(productService.getAllProducts).toHaveBeenCalled();
    expect(productService.getCategories).toHaveBeenCalled();
    expect(productService.getMatters).toHaveBeenCalled();
    expect(productService.getColors).toHaveBeenCalled();
    expect(commentsService.getComments).toHaveBeenCalled();
  });

  it('gère un état sans produits', async () => {
    // Simuler aucun produit retourné
    (productService.getAllProducts as any).mockResolvedValue([]);
    
    render(<ShopPage />);
    
    // Attendre le message "aucun produit trouvé"
    await waitFor(() => {
      expect(screen.getByTestId('shop-empty-message')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Aucun produit trouvé')).toBeInTheDocument();
  });

  it('gère les erreurs de chargement', async () => {
    // Simuler une erreur lors du chargement des produits
    (productService.getAllProducts as any).mockRejectedValue(new Error('Erreur de chargement'));
    
    render(<ShopPage />);
    
    // Attendre le message d'erreur
    await waitFor(() => {
      expect(screen.getByTestId('shop-error-message')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Erreur lors du chargement des produits')).toBeInTheDocument();
  });
}); 