import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-active-sprints')).toBeDefined()
  })
  it('navigates to sprints', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-sprints'))
    expect(screen.getByTestId('sprint-list')).toBeDefined()
  })
  it('navigates to tickets', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('ticket-list')).toBeDefined()
  })
  it('navigates to team', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-team'))
    expect(screen.getByTestId('team-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-sprints'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-active-sprints')).toBeDefined()
  })
})
