import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ json: async () => ({}) }) as unknown as typeof fetch
})

describe('Navigation', () => {
  it('renders nav links', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('nav-home')).toBeTruthy()
    expect(screen.getByTestId('nav-tickets')).toBeTruthy()
    expect(screen.getByTestId('nav-orders')).toBeTruthy()
    expect(screen.getByTestId('nav-profile')).toBeTruthy()
  })

  it('navigates to tickets page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('add-ticket-form')).toBeTruthy()
  })

  it('navigates to orders page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('add-order-form')).toBeTruthy()
  })

  it('navigates to profile page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('profile-form')).toBeTruthy()
  })

  it('home shows dashboard stats', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    const { default: App } = await import('../app/page')
    render(<App />)
    expect(screen.getByTestId('stat-open-tickets')).toBeTruthy()
  })
})
