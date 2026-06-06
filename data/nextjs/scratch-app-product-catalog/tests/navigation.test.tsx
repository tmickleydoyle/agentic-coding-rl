import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
})

describe('Navigation', () => {
  it('renders nav links', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('nav-home')).toBeTruthy()
    expect(screen.getByTestId('nav-products')).toBeTruthy()
    expect(screen.getByTestId('nav-categories')).toBeTruthy()
    expect(screen.getByTestId('nav-reviews')).toBeTruthy()
  })

  it('navigates to products', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('add-product-form')).toBeTruthy()
  })

  it('navigates to categories', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('add-category-form')).toBeTruthy()
  })

  it('navigates to reviews', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-reviews'))
    expect(screen.getByTestId('add-review-form')).toBeTruthy()
  })

  it('home has stat elements', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-total-products')).toBeTruthy()
    expect(screen.getByTestId('stat-avg-rating')).toBeTruthy()
  })
})
