import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-game-count')).toBeDefined()
  })
  it('navigates to games', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-games'))
    expect(screen.getByTestId('game-list')).toBeDefined()
  })
  it('navigates to sessions', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-sessions'))
    expect(screen.getByTestId('session-list')).toBeDefined()
  })
  it('navigates to achievements', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-achievements'))
    expect(screen.getByTestId('achievement-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-games'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-game-count')).toBeDefined()
  })
})
