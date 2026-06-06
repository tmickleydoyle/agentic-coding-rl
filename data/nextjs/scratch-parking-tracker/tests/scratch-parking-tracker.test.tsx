import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Parking Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /parking tracker/i })).toBeTruthy()
  })

  it('shows 3 seed session rows', () => {
    const rows = screen.getAllByTestId('session-row')
    expect(rows.length).toBe(3)
  })

  it('displays total sessions count', () => {
    expect(screen.getByTestId('total-sessions').textContent).toBe('3')
  })

  it('displays total cost of seed data', () => {
    expect(screen.getByTestId('total-cost').textContent).toBe('$82.50')
  })

  it('displays average cost of seed data', () => {
    expect(screen.getByTestId('avg-cost').textContent).toBe('$27.50')
  })

  it('adds a new session', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('location-input'), 'Mall Parking')
    await user.type(screen.getByTestId('date-input'), '2024-02-01')
    await user.type(screen.getByTestId('duration-input'), '3')
    await user.type(screen.getByTestId('cost-input'), '6')
    await user.click(screen.getByTestId('add-btn'))
    const rows = screen.getAllByTestId('session-row')
    expect(rows.length).toBe(4)
    expect(screen.getByTestId('total-sessions').textContent).toBe('4')
  })

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toMatch(/please fill in all required fields/i)
  })

  it('clears form after successful add', async () => {
    const user = userEvent.setup()
    const locInput = screen.getByTestId('location-input') as HTMLInputElement
    await user.type(locInput, 'Test Spot')
    await user.type(screen.getByTestId('date-input'), '2024-02-01')
    await user.type(screen.getByTestId('duration-input'), '1')
    await user.type(screen.getByTestId('cost-input'), '5')
    await user.click(screen.getByTestId('add-btn'))
    expect(locInput.value).toBe('')
  })

  it('deletes a session', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    const rows = screen.getAllByTestId('session-row')
    expect(rows.length).toBe(2)
    expect(screen.getByTestId('total-sessions').textContent).toBe('2')
  })

  it('updates total cost after delete', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-2'))
    expect(screen.getByTestId('total-cost').textContent).toBe('$10.50')
  })

  it('filters sessions by location', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'Airport')
    const rows = screen.getAllByTestId('session-row')
    expect(rows.length).toBe(1)
  })

  it('filter does not affect summary stats', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'Airport')
    expect(screen.getByTestId('total-sessions').textContent).toBe('3')
  })

  it('shows empty list when filter has no matches', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'zzznomatch')
    expect(screen.queryAllByTestId('session-row').length).toBe(0)
  })

  it('shows zero avg cost when all sessions deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    expect(screen.getByTestId('avg-cost').textContent).toBe('$0.00')
    expect(screen.getByTestId('total-sessions').textContent).toBe('0')
  })
})
