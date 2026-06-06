import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders navbar', () => {
    render(<App />)
    expect(screen.getByTestId('navbar')).toBeTruthy()
  })

  it('shows home by default', () => {
    render(<App />)
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })

  it('navigates to assets', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-assets'))
    expect(screen.getByTestId('assets-page')).toBeTruthy()
  })

  it('navigates to depreciation', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-depreciation'))
    expect(screen.getByTestId('depreciation-page')).toBeTruthy()
  })

  it('navigates to categories', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('categories-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-assets'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
