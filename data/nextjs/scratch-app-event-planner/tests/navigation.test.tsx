import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-event-count')).toBeDefined()
  })
  it('navigates to events', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-events'))
    expect(screen.getByTestId('event-list')).toBeDefined()
  })
  it('navigates to guests', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-guests'))
    expect(screen.getByTestId('guest-list')).toBeDefined()
  })
  it('navigates to agenda', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-agenda'))
    expect(screen.getByTestId('agenda-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-events'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-event-count')).toBeDefined()
  })
})
