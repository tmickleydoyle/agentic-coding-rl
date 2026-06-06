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

  it('navigates to library', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-library'))
    expect(screen.getByTestId('library-page')).toBeTruthy()
  })

  it('navigates to artists', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-artists'))
    expect(screen.getByTestId('artists-page')).toBeTruthy()
  })

  it('navigates to queue', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-library'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
