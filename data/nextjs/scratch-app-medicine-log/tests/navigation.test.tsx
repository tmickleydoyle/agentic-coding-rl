import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-medicine-count')).toBeDefined()
  })

  it('navigates to medicines page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-medicines'))
    expect(screen.getByTestId('medicine-list')).toBeDefined()
  })

  it('navigates to log page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    expect(screen.getByTestId('log-list')).toBeDefined()
  })

  it('navigates to schedule page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('schedule-list')).toBeDefined()
  })

  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-medicines'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-medicine-count')).toBeDefined()
  })
})
