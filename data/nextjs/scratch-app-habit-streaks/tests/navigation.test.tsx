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

  it('navigates to habits', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('habits-page')).toBeTruthy()
  })

  it('navigates to streaks', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-streaks'))
    expect(screen.getByTestId('streaks-page')).toBeTruthy()
  })

  it('navigates to history', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-page')).toBeTruthy()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-streaks'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('home-page')).toBeTruthy()
  })
})
