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
    expect(screen.getByTestId('nav-inventory')).toBeTruthy()
    expect(screen.getByTestId('nav-locations')).toBeTruthy()
    expect(screen.getByTestId('nav-movements')).toBeTruthy()
  })

  it('navigates to inventory', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-inventory'))
    expect(screen.getByTestId('add-inventory-form')).toBeTruthy()
  })

  it('navigates to locations', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-locations'))
    expect(screen.getByTestId('add-location-form')).toBeTruthy()
  })

  it('navigates to movements', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-movements'))
    expect(screen.getByTestId('add-movement-form')).toBeTruthy()
  })

  it('home shows stats', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-total-items')).toBeTruthy()
    expect(screen.getByTestId('stat-low-stock')).toBeTruthy()
  })
})
