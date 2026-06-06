import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders navbar', () => {
    render(<App />)
    expect(screen.getByTestId('navbar')).toBeTruthy()
  })

  it('shows home page by default', () => {
    render(<App />)
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })

  it('navigates to recipes page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('recipes-page')).toBeTruthy()
  })

  it('navigates to ingredients page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-ingredients'))
    expect(screen.getByTestId('ingredients-page')).toBeTruthy()
  })

  it('navigates to favorites page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('favorites-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-recipes'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
