import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getInventory, getLocations } from '../lib/store'

beforeEach(() => { __reset() })

describe('Inventory feature', () => {
  it('displays 5 seed items', async () => {
    const { InventoryPage } = await import('../app/inventory/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('location')) return { json: async () => getLocations() }
      return { json: async () => getInventory() }
    }) as unknown as typeof fetch
    render(<InventoryPage />)
    await waitFor(() => { expect(screen.getAllByTestId('inventory-item').length).toBe(5) })
  })

  it('shows item name', async () => {
    const { InventoryPage } = await import('../app/inventory/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('location')) return { json: async () => getLocations() }
      return { json: async () => getInventory() }
    }) as unknown as typeof fetch
    render(<InventoryPage />)
    await waitFor(() => { expect(screen.getAllByTestId('item-name')[0].textContent).toBe('Widget A') })
  })

  it('shows item quantity', async () => {
    const { InventoryPage } = await import('../app/inventory/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('location')) return { json: async () => getLocations() }
      return { json: async () => getInventory() }
    }) as unknown as typeof fetch
    render(<InventoryPage />)
    await waitFor(() => { expect(screen.getAllByTestId('item-quantity')[0].textContent).toBe('150') })
  })

  it('add item form fields exist', async () => {
    const { InventoryPage } = await import('../app/inventory/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<InventoryPage />)
    expect(screen.getByTestId('input-item-name')).toBeTruthy()
    expect(screen.getByTestId('input-item-sku')).toBeTruthy()
    expect(screen.getByTestId('input-item-quantity')).toBeTruthy()
    expect(screen.getByTestId('input-item-category')).toBeTruthy()
    expect(screen.getByTestId('btn-add-item')).toBeTruthy()
  })

  it('submits new item via POST', async () => {
    const { InventoryPage } = await import('../app/inventory/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<InventoryPage />)
    fireEvent.change(screen.getByTestId('input-item-name'), { target: { value: 'New Item' } })
    fireEvent.change(screen.getByTestId('input-item-sku'), { target: { value: 'SKU-NEW' } })
    fireEvent.change(screen.getByTestId('input-item-quantity'), { target: { value: '25' } })
    fireEvent.change(screen.getByTestId('input-item-category'), { target: { value: 'Test' } })
    fireEvent.click(screen.getByTestId('btn-add-item'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/inventory', expect.objectContaining({ method: 'POST' }))
    })
  })
})
