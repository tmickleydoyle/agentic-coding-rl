import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-book-count')).toBeDefined()
  })
  it('navigates to books', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-books'))
    expect(screen.getByTestId('book-list')).toBeDefined()
  })
  it('navigates to reviews', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-reviews'))
    expect(screen.getByTestId('review-list')).toBeDefined()
  })
  it('navigates to members', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-books'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-book-count')).toBeDefined()
  })
})
