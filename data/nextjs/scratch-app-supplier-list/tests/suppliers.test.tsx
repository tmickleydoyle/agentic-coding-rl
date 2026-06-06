import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getSuppliers } from '../lib/store'

beforeEach(() => { __reset() })

describe('Suppliers feature', () => {
  it('displays 5 seed suppliers', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getSuppliers() }) as unknown as typeof fetch
    render(<SuppliersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('supplier-item').length).toBe(5) })
  })

  it('shows supplier name', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getSuppliers() }) as unknown as typeof fetch
    render(<SuppliersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('supplier-name')[0].textContent).toBe('Acme Corp') })
  })

  it('shows supplier status', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getSuppliers() }) as unknown as typeof fetch
    render(<SuppliersPage />)
    await waitFor(() => {
      const statuses = screen.getAllByTestId('supplier-status')
      expect(statuses[0].textContent).toBe('active')
    })
  })

  it('toggle button present for each supplier', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getSuppliers() }) as unknown as typeof fetch
    render(<SuppliersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('btn-toggle-supplier').length).toBe(5) })
  })

  it('add supplier form has required fields', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<SuppliersPage />)
    expect(screen.getByTestId('input-supplier-name')).toBeTruthy()
    expect(screen.getByTestId('input-supplier-category')).toBeTruthy()
    expect(screen.getByTestId('input-supplier-country')).toBeTruthy()
    expect(screen.getByTestId('btn-add-supplier')).toBeTruthy()
  })

  it('submits new supplier via POST', async () => {
    const { SuppliersPage } = await import('../app/suppliers/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<SuppliersPage />)
    fireEvent.change(screen.getByTestId('input-supplier-name'), { target: { value: 'New Supplier' } })
    fireEvent.change(screen.getByTestId('input-supplier-category'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByTestId('input-supplier-country'), { target: { value: 'Canada' } })
    fireEvent.click(screen.getByTestId('btn-add-supplier'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/suppliers', expect.objectContaining({ method: 'POST' }))
    })
  })
})
