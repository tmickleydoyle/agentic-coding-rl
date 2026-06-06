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
    expect(screen.getByTestId('nav-suppliers')).toBeTruthy()
    expect(screen.getByTestId('nav-contacts')).toBeTruthy()
    expect(screen.getByTestId('nav-contracts')).toBeTruthy()
  })

  it('navigates to suppliers', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('add-supplier-form')).toBeTruthy()
  })

  it('navigates to contacts', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-contacts'))
    expect(screen.getByTestId('add-contact-form')).toBeTruthy()
  })

  it('navigates to contracts', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-contracts'))
    expect(screen.getByTestId('add-contract-form')).toBeTruthy()
  })

  it('home shows dashboard stats', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-total-suppliers')).toBeTruthy()
    expect(screen.getByTestId('stat-active-contracts')).toBeTruthy()
  })
})
