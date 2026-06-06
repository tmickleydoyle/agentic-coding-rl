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

  it('navigates to polls', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('polls-page')).toBeTruthy()
  })

  it('navigates to vote', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-vote'))
    expect(screen.getByTestId('vote-page')).toBeTruthy()
  })

  it('navigates to results', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-results'))
    expect(screen.getByTestId('results-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-polls'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
