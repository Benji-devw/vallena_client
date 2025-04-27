import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/home/Hero'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

test('Hero', () => {
  render(<Hero />)
  expect(screen.getByRole('heading', { level: 1, name: 'Vallena Couture' })).toBeDefined()
})