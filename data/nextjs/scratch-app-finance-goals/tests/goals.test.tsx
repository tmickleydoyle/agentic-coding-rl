import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../app/page'

describe('Goals Feature', () => {
  it('shows home dashboard total-saved', () => {
    render(<App />)
    // 4500 + 3200 + 800 = 8500
    expect(screen.getByTestId('total-saved').textContent).toBe('8500')
  })

  it('shows home dashboard total-target', () => {
    render(<App />)
    // 10000 + 3000 + 2000 = 15000
    expect(screen.getByTestId('total-target').textContent).toBe('15000')
  })

  it('shows active goals count (goals not yet completed)', () => {
    render(<App />)
    // g1 (4500<10000), g3 (800<2000) = 2; g2 completed (3200>=3000)
    expect(screen.getByTestId('active-goals-count').textContent).toBe('2')
  })

  it('renders seed goal cards on goals page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('goal-card-g1')).toBeTruthy()
    expect(screen.getByTestId('goal-card-g2')).toBeTruthy()
    expect(screen.getByTestId('goal-card-g3')).toBeTruthy()
  })

  it('shows progress bar for goal', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    // g1: 4500/10000 = 45%
    expect(screen.getByTestId('goal-progress-g1')).toBeTruthy()
  })

  it('progress bar caps at 100% for completed goal', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    // g2: 3200/3000 > 100 => capped at 100
    const bar = screen.getByTestId('goal-progress-g2')
    expect(bar.textContent).toContain('100')
  })

  it('adds a new goal', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Car Fund' } })
    fireEvent.change(screen.getByTestId('input-target'), { target: { value: '5000' } })
    fireEvent.change(screen.getByTestId('input-current'), { target: { value: '1000' } })
    fireEvent.change(screen.getByTestId('input-deadline'), { target: { value: '2027-01-01' } })
    fireEvent.change(screen.getByTestId('input-category'), { target: { value: 'Transport' } })
    fireEvent.click(screen.getByTestId('add-goal-btn'))
    expect(screen.getByText('Car Fund')).toBeTruthy()
  })

  it('does not add goal with missing name', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    const before = screen.getAllByTestId(/goal-card-/).length
    fireEvent.click(screen.getByTestId('add-goal-btn'))
    expect(screen.getAllByTestId(/goal-card-/).length).toBe(before)
  })
})
