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

  it('navigates to invoices', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-invoices'))
    expect(screen.getByTestId('invoices-page')).toBeTruthy()
  })

  it('navigates to clients', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-clients'))
    expect(screen.getByTestId('clients-page')).toBeTruthy()
  })

  it('navigates to preview', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    expect(screen.getByTestId('preview-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-invoices'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
