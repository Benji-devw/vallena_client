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
    expect(skeletonElement).toBeInTheDocument();

    // Attendre que les produits soient chargés
    await waitFor(() => {
      const productsGrid = screen.queryByTestId('shop-products-grid');
      return productsGrid !== null;
    }, { timeout: 5000 });
    
    // Vérifier que les produits sont affichés avec les bons titres
    await waitFor(() => {
      const product1Title = screen.getByTestId('product-title-1');
      const product2Title = screen.getByTestId('product-title-2');
      expect(product1Title).toHaveTextContent('Produit 1');
      expect(product2Title).toHaveTextContent('Produit 2');
    }, { timeout: 5000 });
    
    // Vérifier que les services ont été appelés
    expect(productService.getAllProducts).toHaveBeenCalled();
    expect(productService.getCategories).toHaveBeenCalled();
    expect(productService.getMatters).toHaveBeenCalled();
    expect(productService.getColors).toHaveBeenCalled();
  });

  it.skip('gère un état sans produits', async () => {
    // Simuler aucun produit retourné
    (productService.getAllProducts as any).mockResolvedValue([]);

    render(<ShopPage />);

    // Attendre que le skeleton disparaisse et que le message apparaisse
    await waitFor(() => {
      const skeleton = screen.queryByTestId('shop-loading-skeleton');
      const emptyMessage = screen.queryByTestId('shop-empty-message');
      return skeleton === null && emptyMessage !== null;
    }, { timeout: 5000 });

    // Vérifier que le message est bien affiché
    const emptyMessage = screen.getByTestId('shop-empty-message');
    console.log(emptyMessage);
    expect(emptyMessage).toHaveTextContent('Aucun produit trouvé');
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