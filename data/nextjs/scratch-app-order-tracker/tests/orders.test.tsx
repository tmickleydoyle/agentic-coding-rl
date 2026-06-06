import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getOrders } from '../lib/store'

beforeEach(() => { __reset() })

describe('Orders feature', () => {
  it('displays 5 seed orders', async () => {
    const { OrdersPage } = await import('../app/orders/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getOrders() }) as unknown as typeof fetch
    render(<OrdersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('order-item').length).toBe(5) })
  })

  it('shows order number', async () => {
    const { OrdersPage } = await import('../app/orders/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getOrders() }) as unknown as typeof fetch
    render(<OrdersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('order-number')[0].textContent).toBe('ORD-2001') })
  })

  it('shows order customer', async () => {
    const { OrdersPage } = await import('../app/orders/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getOrders() }) as unknown as typeof fetch
    render(<OrdersPage />)
    await waitFor(() => { expect(screen.getAllByTestId('order-customer')[0].textContent).toBe('Alice Green') })
  })

  it('add order form fields exist', async () => {
    const { OrdersPage } = await import('../app/orders/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<OrdersPage />)
    expect(screen.getByTestId('input-order-number')).toBeTruthy()
    expect(screen.getByTestId('input-order-customer')).toBeTruthy()
    expect(screen.getByTestId('input-order-date')).toBeTruthy()
    expect(screen.getByTestId('input-order-total')).toBeTruthy()
    expect(screen.getByTestId('btn-add-order')).toBeTruthy()
  })

  it('submits new order via POST', async () => {
    const { OrdersPage } = await import('../app/orders/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<OrdersPage />)
    fireEvent.change(screen.getByTestId('input-order-number'), { target: { value: 'ORD-3001' } })
    fireEvent.change(screen.getByTestId('input-order-customer'), { target: { value: 'Test Customer' } })
    fireEvent.change(screen.getByTestId('input-order-date'), { target: { value: '2024-06-01' } })
    fireEvent.change(screen.getByTestId('input-order-total'), { target: { value: '100' } })
    fireEvent.click(screen.getByTestId('btn-add-order'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', expect.objectContaining({ method: 'POST' }))
    })
  })
})
