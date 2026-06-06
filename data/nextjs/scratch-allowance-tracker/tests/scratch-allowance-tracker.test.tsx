import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Allowance Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /allowance tracker/i })).toBeTruthy()
  })

  it('shows correct total earned from seed data', () => {
    // 10 + 10 + 10 = 30
    expect(screen.getByTestId('total-earned').textContent).toContain('$30.00')
  })

  it('shows correct total spent from seed data', () => {
    // 2.50 + 4.00 = 6.50
    expect(screen.getByTestId('total-spent').textContent).toContain('$6.50')
  })

  it('shows correct balance from seed data', () => {
    // 30 - 6.50 = 23.50
    expect(screen.getByTestId('balance').textContent).toContain('$23.50')
  })

  it('renders all 5 seed transaction rows', () => {
    expect(screen.getByTestId('row-1')).toBeTruthy()
    expect(screen.getByTestId('row-5')).toBeTruthy()
  })

  it('shows running balance for last row', () => {
    // row 5: running balance = 10 - 2.50 + 10 - 4 + 10 = 23.50
    expect(screen.getByTestId('running-balance-5').textContent).toContain('$23.50')
  })

  it('adds an earning transaction', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-01-28')
    await user.type(screen.getByTestId('desc-input'), 'Bonus')
    await user.selectOptions(screen.getByTestId('type-select'), 'earning')
    await user.type(screen.getByTestId('amount-input'), '5')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('total-earned').textContent).toContain('$35.00')
    expect(screen.getByTestId('balance').textContent).toContain('$28.50')
  })

  it('adds a spending transaction', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-01-28')
    await user.type(screen.getByTestId('desc-input'), 'Toy')
    await user.selectOptions(screen.getByTestId('type-select'), 'spending')
    await user.type(screen.getByTestId('amount-input'), '3')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.getByTestId('total-spent').textContent).toContain('$9.50')
    expect(screen.getByTestId('balance').textContent).toContain('$20.50')
  })

  it('does not add transaction with empty description', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-01-28')
    await user.type(screen.getByTestId('amount-input'), '5')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.queryByTestId('row-6')).toBeNull()
  })

  it('does not add transaction with zero amount', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('date-input'), '2024-01-28')
    await user.type(screen.getByTestId('desc-input'), 'Test')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('add-btn'))
    expect(screen.queryByTestId('row-6')).toBeNull()
  })

  it('deletes a transaction and updates totals', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('delete-btn-1'))
    expect(screen.queryByTestId('row-1')).toBeNull()
    expect(screen.getByTestId('total-earned').textContent).toContain('$20.00')
    expect(screen.getByTestId('balance').textContent).toContain('$13.50')
  })

  it('filters to show only earnings', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-earnings'))
    expect(screen.getByTestId('row-1')).toBeTruthy()
    expect(screen.queryByTestId('row-2')).toBeNull()
  })

  it('filters to show only spending', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-spending'))
    expect(screen.getByTestId('row-2')).toBeTruthy()
    expect(screen.queryByTestId('row-1')).toBeNull()
  })

  it('filter all shows all rows', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-earnings'))
    await user.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('row-1')).toBeTruthy()
    expect(screen.getByTestId('row-2')).toBeTruthy()
  })

  it('running balance is cumulative and correct for row 3', () => {
    // row 1: +10 = 10, row 2: -2.50 = 7.50, row 3: +10 = 17.50
    expect(screen.getByTestId('running-balance-3').textContent).toContain('$17.50')
  })
})
