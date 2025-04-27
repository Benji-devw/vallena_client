import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '@/components/shop/Filters';

describe('Filters', () => {
  const mockCategories = [
    { id: '1', name: 'Vêtements' },
    { id: '2', name: 'Accessoires' }
  ];
  
  const mockMatters = [
    { id: '1', name: 'Coton' },
    { id: '2', name: 'Soie' }
  ];
  
  const mockColors = [
    { id: '1', name: 'Rouge' },
    { id: '2', name: 'Bleu' }
  ];
  
  const mockOnFilterChange = vi.fn();
  
  it('rend correctement les filtres', () => {
    render(
      <Filters 
        onFilterChange={mockOnFilterChange} 
        categories={mockCategories}
        matters={mockMatters}
        colors={mockColors}
      />
    );
    
    // Vérifier que le conteneur des filtres est présent
    expect(screen.getByTestId('filters-container')).toBeInTheDocument();
    
    // Vérifier que les titres des sections sont affichés
    expect(screen.getByTestId('filters-title')).toHaveTextContent('Filtres');
    expect(screen.getByTestId('category-filter-label')).toHaveTextContent('Catégories');
    expect(screen.getByTestId('price-filter-label')).toHaveTextContent('Prix');
    expect(screen.getByTestId('matter-filter-label')).toHaveTextContent('Matière');
    expect(screen.getByTestId('color-filter-label')).toHaveTextContent('Couleur');
    
    // Vérifier que les sections de filtres sont présentes
    expect(screen.getByTestId('category-filter-section')).toBeInTheDocument();
    expect(screen.getByTestId('price-filter-section')).toBeInTheDocument();
    expect(screen.getByTestId('matter-filter-section')).toBeInTheDocument();
    expect(screen.getByTestId('color-filter-section')).toBeInTheDocument();
    
    // Vérifier que les sélecteurs sont présents
    expect(screen.getByTestId('category-filter-select')).toBeInTheDocument();
    expect(screen.getByTestId('matter-filter-select')).toBeInTheDocument();
    expect(screen.getByTestId('color-filter-select')).toBeInTheDocument();
    
    // Vérifier que les options de catégorie sont affichées
    expect(screen.getByTestId('category-option-1')).toHaveTextContent('Vêtements');
    expect(screen.getByTestId('category-option-2')).toHaveTextContent('Accessoires');
    
    // Vérifier que les options de matière sont affichées
    expect(screen.getByTestId('matter-option-1')).toHaveTextContent('Coton');
    expect(screen.getByTestId('matter-option-2')).toHaveTextContent('Soie');
    
    // Vérifier que les options de couleur sont affichées
    expect(screen.getByTestId('color-option-1')).toHaveTextContent('Rouge');
    expect(screen.getByTestId('color-option-2')).toHaveTextContent('Bleu');
    
    // Vérifier que les contrôles de prix sont présents
    expect(screen.getByTestId('min-price-slider')).toBeInTheDocument();
    expect(screen.getByTestId('max-price-slider')).toBeInTheDocument();
  });
  
  it('permet de réinitialiser les filtres', () => {
    render(
      <Filters 
        onFilterChange={mockOnFilterChange} 
        categories={mockCategories}
        matters={mockMatters}
        colors={mockColors}
      />
    );
    
    // Vérifier que le bouton de réinitialisation est présent
    const resetButton = screen.getByTestId('reset-filters-button');
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveTextContent('Réinitialiser');
    
    // Simuler un clic sur le bouton de réinitialisation
    fireEvent.click(resetButton);
    
    // Vérifier que la fonction onFilterChange a été appelée
    expect(mockOnFilterChange).toHaveBeenCalledWith(true);
  });
}); 