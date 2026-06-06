import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Habits Feature', () => {
  it('shows today date on home', () => {
    render(<App />)
    expect(screen.getByTestId('today-date').textContent).toBe('2026-06-06')
  })

  it('shows habit count on home', () => {
    render(<App />)
    expect(screen.getByTestId('habit-count').textContent).toBe('3')
  })

  it('shows completed today count', () => {
    render(<App />)
    // only h1 completed on 2026-06-06
    expect(screen.getByTestId('completed-today').textContent).toBe('1')
  })

  it('renders seed habits on habits page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('habit-item-h1')).toBeTruthy()
    expect(screen.getByTestId('habit-item-h2')).toBeTruthy()
    expect(screen.getByTestId('habit-item-h3')).toBeTruthy()
  })

  it('adds a new habit', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    fireEvent.change(screen.getByTestId('input-habit-name'), { target: { value: 'Meditate' } })
    fireEvent.change(screen.getByTestId('input-habit-category'), { target: { value: 'Wellness' } })
    fireEvent.click(screen.getByTestId('add-habit-btn'))
    expect(screen.getByText('Meditate')).toBeTruthy()
  })

  it('log page shows checkboxes for each habit', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    expect(screen.getByTestId('log-check-h1')).toBeTruthy()
    expect(screen.getByTestId('log-check-h2')).toBeTruthy()
    expect(screen.getByTestId('log-check-h3')).toBeTruthy()
  })

  it('log checkbox for h1 is checked (completed today)', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    const cb = screen.getByTestId('log-check-h1') as HTMLInputElement
    expect(cb.checked).toBe(true)
  })

  it('log checkbox for h2 is not checked today', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    const cb = screen.getByTestId('log-check-h2') as HTMLInputElement
    expect(cb.checked).toBe(false)
  })

  it('stats shows correct completion counts', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-h1').textContent).toContain('2')
    expect(screen.getByTestId('stat-h2').textContent).toContain('1')
    expect(screen.getByTestId('stat-h3').textContent).toContain('0')
  })

  it('toggling log checkbox updates completed-today count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-log'))
    fireEvent.click(screen.getByTestId('log-check-h2'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('completed-today').textContent).toBe('2')
  })
})
