import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Toll Calculator', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /toll calculator/i })).toBeTruthy()
  })

  it('shows 4 seed toll rows', () => {
    expect(screen.getAllByTestId('toll-row').length).toBe(4)
  })

  it('shows correct total tolls count', () => {
    expect(screen.getByTestId('total-tolls').textContent).toBe('4')
  })

  it('shows correct total amount', () => {
    // 3.50 + 5.75 + 4.00 + 1.25 = 14.50
    expect(screen.getByTestId('total-amount').textContent).toBe('$14.50')
  })

  it('shows correct EZPass total', () => {
    // 3.50 + 4.00 + 1.25 = 8.75
    expect(screen.getByTestId('ezpass-total').textContent).toBe('$8.75')
  })

  it('shows correct Cash total', () => {
    expect(screen.getByTestId('cash-total').textContent).toBe('$5.75')
  })

  it('shows top road', () => {
    // I-95 North: 3.50 + 4.00 = 7.50, Turnpike: 5.75, Garden State: 1.25
    expect(screen.getByTestId('top-road').textContent).toBe('I-95 North')
  })

  it('adds a new toll', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-02-01')
    await user.type(screen.getByTestId('road-input'), 'I-78')
    await user.type(screen.getByTestId('plaza-input'), 'Exit 5')
    await user.type(screen.getByTestId('amount-input'), '2.50')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('toll-row').length).toBe(5)
    expect(screen.getByTestId('total-tolls').textContent).toBe('5')
  })

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toMatch(/please fill in all required fields/i)
  })

  it('clears form after successful add', async () => {
    const user = userEvent.setup()
    const roadInput = screen.getByTestId('road-input') as HTMLInputElement
    await user.type(screen.getByTestId('date-input'), '2024-02-01')
    await user.type(roadInput, 'I-78')
    await user.type(screen.getByTestId('plaza-input'), 'Exit 5')
    await user.type(screen.getByTestId('amount-input'), '2.50')
    await user.click(screen.getByTestId('add-btn'))
    expect(roadInput.value).toBe('')
  })

  it('deletes a toll', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.getAllByTestId('toll-row').length).toBe(3)
    expect(screen.getByTestId('total-tolls').textContent).toBe('3')
  })

  it('payment filter shows only matching rows', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('payment-filter'), 'Cash')
    expect(screen.getAllByTestId('toll-row').length).toBe(1)
  })

  it('payment filter does not affect stats', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('payment-filter'), 'Cash')
    expect(screen.getByTestId('total-tolls').textContent).toBe('4')
    expect(screen.getByTestId('total-amount').textContent).toBe('$14.50')
  })

  it('vehicle filter shows only matching rows', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('vehicle-filter'), 'Motorcycle')
    expect(screen.getAllByTestId('toll-row').length).toBe(1)
  })

  it('both filters apply together', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('payment-filter'), 'EZPass')
    await user.selectOptions(screen.getByTestId('vehicle-filter'), 'Car')
    expect(screen.getAllByTestId('toll-row').length).toBe(2)
  })

  it('shows N/A top road when all deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    await user.click(screen.getByTestId('delete-btn-4'))
    expect(screen.getByTestId('top-road').textContent).toBe('N/A')
    expect(screen.getByTestId('total-amount').textContent).toBe('$0.00')
  })
})
