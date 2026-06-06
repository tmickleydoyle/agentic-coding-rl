import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Streaks Feature', () => {
  it('shows longest streak on home (h1=3)', () => {
    render(<App />)
    expect(screen.getByTestId('longest-streak').textContent).toBe('3')
  })

  it('shows total habits on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-habits').textContent).toBe('3')
  })

  it('shows total days logged on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-days-logged').textContent).toBe('6')
  })

  it('renders seed habits on habits page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('habit-card-h1')).toBeTruthy()
    expect(screen.getByTestId('habit-card-h2')).toBeTruthy()
    expect(screen.getByTestId('habit-card-h3')).toBeTruthy()
  })

  it('adds a new habit', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-habits'))
    fireEvent.change(screen.getByTestId('input-habit-name'), { target: { value: 'Stretching' } })
    fireEvent.change(screen.getByTestId('input-habit-color'), { target: { value: 'green' } })
    fireEvent.click(screen.getByTestId('add-habit-btn'))
    expect(screen.getByText('Stretching')).toBeTruthy()
  })

  it('h1 streak is 3', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-streaks'))
    expect(screen.getByTestId('streak-h1').textContent).toContain('3')
  })

  it('h2 streak is 1 (gap on 06-05)', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-streaks'))
    expect(screen.getByTestId('streak-h2').textContent).toContain('1')
  })

  it('h3 streak is 0 (last on 06-01)', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-streaks'))
    expect(screen.getByTestId('streak-h3').textContent).toContain('0')
  })

  it('history page shows all completions', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-item-c1')).toBeTruthy()
    expect(screen.getByTestId('history-item-c6')).toBeTruthy()
  })

  it('history items show habit id and date', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-item-c1').textContent).toContain('h1')
    expect(screen.getByTestId('history-item-c1').textContent).toContain('2026-06-06')
  })
})
