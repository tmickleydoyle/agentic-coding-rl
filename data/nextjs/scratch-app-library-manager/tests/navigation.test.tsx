import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('node-fetch', () => ({}))

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => [],
    ok: true,
  }) as unknown as typeof fetch
})

describe('Navigation', () => {
  it('renders nav links', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('nav-home')).toBeTruthy()
    expect(screen.getByTestId('nav-books')).toBeTruthy()
    expect(screen.getByTestId('nav-members')).toBeTruthy()
    expect(screen.getByTestId('nav-loans')).toBeTruthy()
  })

  it('navigates to books page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-books'))
    expect(screen.getByTestId('add-book-form')).toBeTruthy()
  })

  it('navigates to members page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('add-member-form')).toBeTruthy()
  })

  it('navigates to loans page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-loans'))
    expect(screen.getByTestId('add-loan-form')).toBeTruthy()
  })

  it('returns to home page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-books'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('stat-total-books')).toBeTruthy()
  })
})
