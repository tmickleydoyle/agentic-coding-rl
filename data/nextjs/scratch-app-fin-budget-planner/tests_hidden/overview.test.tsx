import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('overview stats', () => {
  it('shows planned, actual, and remaining totals from seed data', () => {
    render(<App />)
    // planned: 1200+400+150 = 1750; actual: 1200+460 = 1660; remaining: 90
    expect(screen.getByTestId('stat-planned-value')).toHaveTextContent('1750')
    expect(screen.getByTestId('stat-actual-value')).toHaveTextContent('1660')
    expect(screen.getByTestId('stat-remaining-value')).toHaveTextContent('90')
  })

  it('shows the over-budget count and an alert', () => {
    render(<App />)
    // Groceries (c2): planned 400, actual 460 => over budget
    expect(screen.getByTestId('stat-overbudget-value')).toHaveTextContent('1')
    expect(screen.getByTestId('overall-alert')).toBeInTheDocument()
    expect(screen.queryByTestId('overall-ok')).not.toBeInTheDocument()
  })

  it('shows the current currency', () => {
    render(<App />)
    expect(screen.getByTestId('currency-label')).toHaveTextContent('USD')
  })

  it('updates totals after adding an expense', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.selectOptions(screen.getByTestId('category-select'), 'c3')
    await user.type(screen.getByTestId('amount-input'), '50')
    await user.click(screen.getByTestId('submit-expense'))
    // returns to overview; actual now 1710, remaining 40
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('stat-actual-value')).toHaveTextContent('1710')
    expect(screen.getByTestId('stat-remaining-value')).toHaveTextContent('40')
  })
})
