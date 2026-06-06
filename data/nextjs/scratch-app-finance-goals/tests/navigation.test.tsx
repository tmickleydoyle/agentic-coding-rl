import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../app/page'

describe('Navigation', () => {
  it('renders navbar', () => {
    render(<App />)
    expect(screen.getByTestId('navbar')).toBeTruthy()
  })

  it('shows home page by default', () => {
    render(<App />)
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })

  it('navigates to goals page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('goals-page')).toBeTruthy()
  })

  it('navigates to budget page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-budget'))
    expect(screen.getByTestId('budget-page')).toBeTruthy()
  })

  it('navigates to reports page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-reports'))
    expect(screen.getByTestId('reports-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
