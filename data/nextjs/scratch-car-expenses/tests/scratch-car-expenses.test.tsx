import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Car Expenses', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /car expenses/i })).toBeTruthy()
  })

  it('shows 4 seed expense rows', () => {
    expect(screen.getAllByTestId('expense-row').length).toBe(4)
  })

  it('shows correct total expenses count', () => {
    expect(screen.getByTestId('total-expenses').textContent).toBe('4')
  })

  it('shows correct total amount', () => {
    expect(screen.getByTestId('total-amount').textContent).toBe('$302.50')
  })

  it('shows category breakdown for Fuel', () => {
    expect(screen.getByTestId('category-Fuel').textContent).toBe('$87.50')
  })

  it('shows category breakdown for Maintenance', () => {
    expect(screen.getByTestId('category-Maintenance').textContent).toBe('$120.00')
  })

  it('adds a new expense', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-03-01')
    await user.type(screen.getByTestId('amount-input'), '30')
    await user.type(screen.getByTestId('description-input'), 'Tire rotation')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getAllByTestId('expense-row').length).toBe(5)
    expect(screen.getByTestId('total-expenses').textContent).toBe('5')
  })

  it('shows error when required fields missing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('error-msg').textContent).toMatch(/please fill in all required fields/i)
  })

  it('deletes an expense', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.getAllByTestId('expense-row').length).toBe(3)
    expect(screen.getByTestId('total-expenses').textContent).toBe('3')
  })

  it('filter shows only matching category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('category-filter'), 'Fuel')
    expect(screen.getAllByTestId('expense-row').length).toBe(2)
  })

  it('filter does not affect stats', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('category-filter'), 'Insurance')
    expect(screen.getByTestId('total-expenses').textContent).toBe('4')
    expect(screen.getByTestId('total-amount').textContent).toBe('$302.50')
  })

  it('edit button shows inline input', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('edit-btn-2'))
    expect(screen.getByTestId('edit-input-2')).toBeTruthy()
    expect(screen.getByTestId('save-btn-2')).toBeTruthy()
  })

  it('saving edit updates amount and stats', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('edit-btn-2'))
    const editInput = screen.getByTestId('edit-input-2') as HTMLInputElement
    await user.clear(editInput)
    await user.type(editInput, '150')
    await user.click(screen.getByTestId('save-btn-2'))
    expect(screen.getByTestId('total-amount').textContent).toBe('$332.50')
  })

  it('shows zero stats when all deleted', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    await user.click(screen.getByTestId('delete-btn-2'))
    await user.click(screen.getByTestId('delete-btn-3'))
    await user.click(screen.getByTestId('delete-btn-4'))
    expect(screen.getByTestId('total-expenses').textContent).toBe('0')
    expect(screen.getByTestId('total-amount').textContent).toBe('$0.00')
  })
})
