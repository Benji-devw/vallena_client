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
    
    // the title is displayed
    expect(screen.getByText('Découvrez nos collections')).toBeTruthy();
    
    // test the buttons
    expect(screen.getByText('Promotions')).toBeTruthy();
    expect(screen.getByText('Nouveautés')).toBeTruthy();
    expect(screen.getByText('Voir les promotions')).toBeTruthy();
    expect(screen.getByText('Voir les nouveautés')).toBeTruthy();
  });

  it('navigates to shop page with sort=promotions when promotions button is clicked', () => {
    render(<ShopNavigation />, { container });
    
    const promotionsButton = screen.getByTestId('home-navigation-promotions');
    fireEvent.click(promotionsButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/shop?sort=promotions');
  });

  it('navigates to shop page with sort=novelty when novelty button is clicked', () => {
    render(<ShopNavigation />, { container });
    
    const noveltyButton = screen.getByTestId('home-navigation-novelty');
    fireEvent.click(noveltyButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/shop?sort=novelty');
  });
});