import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-holdings-count')).toBeDefined()
  })
  it('navigates to holdings', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-holdings'))
    expect(screen.getByTestId('holding-list')).toBeDefined()
  })
  it('navigates to transactions', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-transactions'))
    expect(screen.getByTestId('transaction-list')).toBeDefined()
  })
  it('navigates to performance', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-performance'))
    expect(screen.getByTestId('performance-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-holdings'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-holdings-count')).toBeDefined()
  })
})
