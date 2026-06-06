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
    expect(screen.getByTestId('nav-shifts')).toBeTruthy()
    expect(screen.getByTestId('nav-staff')).toBeTruthy()
    expect(screen.getByTestId('nav-requests')).toBeTruthy()
  })

  it('navigates to shifts page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-shifts'))
    expect(screen.getByTestId('add-shift-form')).toBeTruthy()
  })

  it('navigates to staff page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-staff'))
    expect(screen.getByTestId('add-staff-form')).toBeTruthy()
  })

  it('navigates to requests page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-requests'))
    expect(screen.getByTestId('add-request-form')).toBeTruthy()
  })

  it('home shows dashboard stats', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-total-staff')).toBeTruthy()
  })
})
