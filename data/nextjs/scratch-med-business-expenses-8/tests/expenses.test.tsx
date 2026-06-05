import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExpense(u: U, vendor: string, category: string, amount: string) {
  await u.clear(screen.getByLabelText('Vendor'))
  await u.type(screen.getByLabelText('Vendor'), vendor)
  await u.selectOptions(screen.getByLabelText('Category'), category)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.click(screen.getByRole('button', { name: /add expense/i }))
}

describe('Business Expense Tracker', () => {
  it('starts on the Expenses view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('shows seeded expenses on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Delta Air')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('shows seeded expense amounts formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(screen.getByText('$320.75')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
  })

  it('shows correct initial Showing count', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 expenses')).toBeInTheDocument()
  })

  it('shows correct initial Filtered Total', () => {
    render(<App />)
    // 45 + 320.75 + 9.99 = 375.74
    expect(screen.getByText('Filtered Total: $375.74')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('Summary shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument()
    expect(screen.getByText('Monthly Total: $375.74')).toBeInTheDocument()
    expect(screen.getByText('Office: $45.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $320.75')).toBeInTheDocument()
    expect(screen.getByText('Software: $9.99')).toBeInTheDocument()
    expect(screen.getByText('Food: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Other: $0.00')).toBeInTheDocument()
  })

  it('adds a new expense and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Staples', 'Office', '22.50')
    expect(screen.getByText('Staples')).toBeInTheDocument()
    expect(screen.getByText('$22.50')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 expenses')).toBeInTheDocument()
  })

  it('ignores a new expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '50')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 3 expenses')).toBeInTheDocument()
  })

  it('ignores a new expense with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Nobody')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 3 expenses')).toBeInTheDocument()
  })

  it('deletes an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete github/i }))
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 expenses')).toBeInTheDocument()
  })

  it('filters by category and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Showing: 1 expenses')).toBeInTheDocument()
    expect(screen.getByText('Delta Air')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filter updates Filtered Total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    expect(screen.getByText('Filtered Total: $9.99')).toBeInTheDocument()
  })

  it('filter All shows all expenses and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Showing: 3 expenses')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $375.74')).toBeInTheDocument()
  })

  it('filter with no matches shows 0 expenses and $0.00 total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('new expense appears in Summary totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Uber Eats', 'Food', '18.40')
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 4')).toBeInTheDocument()
    // 375.74 + 18.40 = 394.14
    expect(screen.getByText('Monthly Total: $394.14')).toBeInTheDocument()
    expect(screen.getByText('Food: $18.40')).toBeInTheDocument()
  })

  it('deleted expense is removed from Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete delta air/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 2')).toBeInTheDocument()
    // 45 + 9.99 = 54.99
    expect(screen.getByText('Monthly Total: $54.99')).toBeInTheDocument()
    expect(screen.getByText('Travel: $0.00')).toBeInTheDocument()
  })

  it('toggles theme and shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
  })

  it('theme persists across navigation via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Expenses')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('expenses state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'WeWork', 'Office', '500.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('WeWork')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 expenses')).toBeInTheDocument()
  })
})
