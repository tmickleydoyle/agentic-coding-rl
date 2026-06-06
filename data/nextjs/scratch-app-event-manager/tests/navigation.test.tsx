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
    expect(screen.getByTestId('nav-events')).toBeTruthy()
    expect(screen.getByTestId('nav-attendees')).toBeTruthy()
    expect(screen.getByTestId('nav-schedule')).toBeTruthy()
  })

  it('navigates to events page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-events'))
    expect(screen.getByTestId('add-event-form')).toBeTruthy()
  })

  it('navigates to attendees page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-attendees'))
    expect(screen.getByTestId('add-attendee-form')).toBeTruthy()
  })

  it('navigates to schedule page', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('add-session-form')).toBeTruthy()
  })

  it('returns to home', async () => {
    const { default: App } = await import('../app/page')
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-events'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('stat-total-events')).toBeTruthy()
  })
})
