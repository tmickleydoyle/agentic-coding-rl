import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Road Trip Planner', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /road trip planner/i })).toBeTruthy()
  })

  it('shows 3 seed stops', () => {
    expect(screen.getAllByTestId('stop-row').length).toBe(3)
  })

  it('shows correct stop count', () => {
    expect(screen.getByTestId('stop-count').textContent).toBe('3')
  })

  it('shows correct total miles', () => {
    expect(screen.getByTestId('total-miles').textContent).toBe('460 mi')
  })

  it('shows correct total fuel cost', () => {
    expect(screen.getByTestId('total-fuel').textContent).toBe('$69.00')
  })

  it('shows correct total hotel cost', () => {
    expect(screen.getByTestId('total-hotel').textContent).toBe('$480.00')
  })

  it('shows correct total trip cost', () => {
    expect(screen.getByTestId('total-cost').textContent).toBe('$549.00')
  })

  it('adds a new stop', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('city-input'), 'San Diego')
    await user.type(screen.getByTestId('state-input'), 'CA')
    await user.type(screen.getByTestId('miles-input'), '120')
    await user.type(screen.getByTestId('fuel-input'), '18')
    await user.type(screen.getByTestId('hotel-input'), '110')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('stop-row').length).toBe(4)
    expect(screen.getByTestId('stop-count').textContent).toBe('4')
  })

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toMatch(/please fill in all required fields/i)
  })

  it('deletes a stop', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-2'))
    expect(screen.getAllByTestId('stop-row').length).toBe(2)
    expect(screen.getByTestId('stop-count').textContent).toBe('2')
  })

  it('move down reorders stops', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('move-down-1'))
    const rows = screen.getAllByTestId('stop-row')
    expect(rows[0].querySelector('[data-testid^="city-"]')?.textContent).toBe('Monterey')
  })

  it('move up reorders stops', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('move-up-3'))
    const rows = screen.getAllByTestId('stop-row')
    expect(rows[1].querySelector('[data-testid^="city-"]')?.textContent).toBe('Los Angeles')
  })

  it('search filters stops by city', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'Monterey')
    expect(screen.getAllByTestId('stop-row').length).toBe(1)
  })

  it('search does not affect stats', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'Los Angeles')
    expect(screen.getByTestId('stop-count').textContent).toBe('3')
    expect(screen.getByTestId('total-miles').textContent).toBe('460 mi')
  })

  it('shows zero stats when all stops deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    expect(screen.getByTestId('stop-count').textContent).toBe('0')
    expect(screen.getByTestId('total-miles').textContent).toBe('0 mi')
    expect(screen.getByTestId('total-cost').textContent).toBe('$0.00')
  })
})
