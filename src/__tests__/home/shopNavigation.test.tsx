import { fireEvent, render, screen } from '@testing-library/react';
import ShopNavigation from '@/components/home/ShopNavigation';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock useRouter
const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('ShopNavigation', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ShopNavigation />, { container });
    
    // test le h2
    expect(screen.getByText('Découvrez nos collections')).toBeTruthy();
    
    // test les boutons
    expect(screen.getByText('Promotions')).toBeTruthy();
    expect(screen.getByText('Nouveautés')).toBeTruthy();
    expect(screen.getByText('Voir les promotions')).toBeTruthy();
    expect(screen.getByText('Voir les nouveautés')).toBeTruthy();
  });

  it('navigates to promotions page when promotions button is clicked', () => {
    render(<ShopNavigation />, { container });
    
    const promotionsButton = screen.getByTestId('home-navigation-promotions');
    fireEvent.click(promotionsButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/shop?sort=promotions');
  });

  it('navigates to novelty page when novelty button is clicked', () => {
    render(<ShopNavigation />, { container });
    
    const noveltyButton = screen.getByTestId('home-navigation-novelty');
    fireEvent.click(noveltyButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/shop?sort=novelty');
  });
});