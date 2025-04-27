import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/shop/ProductCard';
import { mockSimpleProduct } from '../../mocks/productMocks';
import { expectProductToBeDisplayed } from '../../utils/testUtils';

describe('ProductCard', () => {
  it('affiche correctement les détails du produit', () => {
    render(<ProductCard product={mockSimpleProduct} />);
    
    // Utiliser l'utilitaire de test pour vérifier l'affichage du produit
    expectProductToBeDisplayed(mockSimpleProduct);
  });

  it('affiche correctement en mode horizontal', () => {
    render(<ProductCard product={mockSimpleProduct} viewMode="horizontal" />);
    
    // Vérifier que la classe pour le mode horizontal est présente
    const container = screen.getByRole('link');
    const flexContainer = container.querySelector('div');
    expect(flexContainer?.className).toContain('flex-row');
  });

  it('affiche les boutons correctement', () => {
    render(<ProductCard product={mockSimpleProduct} />);
    
    // Trouver les boutons
    const wishlistButton = screen.getByTestId('wishlist-button');
    const cartButton = screen.getByTestId('cart-button');
    
    expect(wishlistButton).toBeInTheDocument();
    expect(cartButton).toBeInTheDocument();
    
    // Vérifier les icônes dans les boutons
    const wishlistIcon = wishlistButton.querySelector('svg');
    const cartIcon = cartButton.querySelector('svg');
    
    expect(wishlistIcon).toBeInTheDocument();
    expect(cartIcon).toBeInTheDocument();
    
    // Vérifier que les boutons ont des écouteurs d'événements
    expect(wishlistButton.onclick).not.toBeNull();
    expect(cartButton.onclick).not.toBeNull();
  });
}); 