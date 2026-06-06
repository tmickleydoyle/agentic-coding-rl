import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-article-count')).toBeDefined()
  })
  it('navigates to articles', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-articles'))
    expect(screen.getByTestId('article-list')).toBeDefined()
  })
  it('navigates to categories', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-list')).toBeDefined()
  })
  it('navigates to search', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('search-input')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-articles'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-article-count')).toBeDefined()
  })
})
