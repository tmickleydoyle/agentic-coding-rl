import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getProducts, getCategories } from '../lib/store'

beforeEach(() => { __reset() })

describe('Products feature', () => {
  it('displays 5 seed products', async () => {
    const { ProductsPage } = await import('../app/products/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('categor')) return { json: async () => getCategories() }
      return { json: async () => getProducts() }
    }) as unknown as typeof fetch
    render(<ProductsPage />)
    await waitFor(() => { expect(screen.getAllByTestId('product-item').length).toBe(5) })
  })

  it('shows product name', async () => {
    const { ProductsPage } = await import('../app/products/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('categor')) return { json: async () => getCategories() }
      return { json: async () => getProducts() }
    }) as unknown as typeof fetch
    render(<ProductsPage />)
    await waitFor(() => { expect(screen.getAllByTestId('product-name')[0].textContent).toBe('Wireless Headphones') })
  })

  it('toggle button present for each product', async () => {
    const { ProductsPage } = await import('../app/products/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('categor')) return { json: async () => getCategories() }
      return { json: async () => getProducts() }
    }) as unknown as typeof fetch
    render(<ProductsPage />)
    await waitFor(() => { expect(screen.getAllByTestId('btn-toggle-active').length).toBe(5) })
  })

  it('add product form fields exist', async () => {
    const { ProductsPage } = await import('../app/products/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<ProductsPage />)
    expect(screen.getByTestId('input-product-name')).toBeTruthy()
    expect(screen.getByTestId('input-product-sku')).toBeTruthy()
    expect(screen.getByTestId('input-product-price')).toBeTruthy()
    expect(screen.getByTestId('input-product-stock')).toBeTruthy()
    expect(screen.getByTestId('btn-add-product')).toBeTruthy()
  })

  it('submits new product via POST', async () => {
    const { ProductsPage } = await import('../app/products/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<ProductsPage />)
    fireEvent.change(screen.getByTestId('input-product-name'), { target: { value: 'New Product' } })
    fireEvent.change(screen.getByTestId('input-product-sku'), { target: { value: 'SKU999' } })
    fireEvent.change(screen.getByTestId('input-product-price'), { target: { value: '9.99' } })
    fireEvent.change(screen.getByTestId('input-product-stock'), { target: { value: '10' } })
    fireEvent.click(screen.getByTestId('btn-add-product'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products', expect.objectContaining({ method: 'POST' }))
    })
  })
})
