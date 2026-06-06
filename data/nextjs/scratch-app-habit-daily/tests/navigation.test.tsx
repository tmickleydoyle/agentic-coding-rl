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

  it('navigates to habits page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('habits-page')).toBeTruthy()
  })

  it('navigates to log page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    expect(screen.getByTestId('log-page')).toBeTruthy()
  })

  it('navigates to stats page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stats-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
