import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('bills page', () => {
  it('shows totals across all bills', () => {
    render(<App />)
    // 1400 + 60 + 45 + 30 = 1535
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('1535')
    expect(screen.getByTestId('stat-paid-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-unpaid-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-autopay-value')).toHaveTextContent('2')
  })

  it('lists bills with their status derived from dueDay and today', () => {
    render(<App />)
    // today = 10: b1 due 1 unpaid => overdue, b2 paid => paid, b3 due 15 => upcoming
    expect(screen.getByTestId('bill-b1-status')).toHaveTextContent('overdue')
    expect(screen.getByTestId('bill-b2-status')).toHaveTextContent('paid')
    expect(screen.getByTestId('bill-b3-status')).toHaveTextContent('upcoming')
    expect(screen.getByTestId('bill-b2')).toHaveAttribute('data-paid', 'true')
    expect(screen.getByTestId('bill-b1')).toHaveAttribute('data-paid', 'false')
  })

  it('shows bill name, amount, and due day', () => {
    render(<App />)
    expect(screen.getByTestId('bill-b1-name')).toHaveTextContent('Rent')
    expect(screen.getByTestId('bill-b1-amount')).toHaveTextContent('1400')
    expect(screen.getByTestId('bill-b3-due')).toHaveTextContent('15')
  })

  it('opening a bill navigates to its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('bill-b3-open'))
    expect(screen.getByTestId('page-bill-detail')).toBeInTheDocument()
    expect(screen.getByTestId('bill-name')).toHaveTextContent('Phone')
  })
})
