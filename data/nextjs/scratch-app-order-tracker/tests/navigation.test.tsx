import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
})

describe('Navigation', () => {
  it('renders all nav links', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('nav-home')).toBeTruthy()
    expect(screen.getByTestId('nav-orders')).toBeTruthy()
    expect(screen.getByTestId('nav-shipments')).toBeTruthy()
    expect(screen.getByTestId('nav-returns')).toBeTruthy()
  })

  it('navigates to orders', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('add-order-form')).toBeTruthy()
  })

  it('navigates to shipments', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-shipments'))
    expect(screen.getByTestId('add-shipment-form')).toBeTruthy()
  })

  it('navigates to returns', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-returns'))
    expect(screen.getByTestId('add-return-form')).toBeTruthy()
  })

  it('home shows stats', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-total-orders')).toBeTruthy()
    expect(screen.getByTestId('stat-in-transit')).toBeTruthy()
  })
})
