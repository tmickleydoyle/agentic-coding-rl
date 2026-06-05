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

  it('shows seed data on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Fly Airlines')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('formats seed amounts with two decimal places', () => {
    render(<App />)
    expect(screen.getByText('$120.00')).toBeInTheDocument()
    expect(screen.getByText('$340.50')).toBeInTheDocument()
    expect(screen.getByText('$21.00')).toBeInTheDocument()
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

  it('navigates back to Expenses from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('adds a new expense and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '12.50')
    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.getByText('$12.50')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '50')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('$50.00')).not.toBeInTheDocument()
  })

  it('ignores an expense with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Ghost')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Ghost')).not.toBeInTheDocument()
  })

  it('deletes an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete github/i }))
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
  })

  it('shows visible total for all expenses on load', () => {
    render(<App />)
    // 120.00 + 340.50 + 21.00 = 481.50
    expect(screen.getByText('Visible Total: $481.50')).toBeInTheDocument()
  })

  it('filters by category and updates visible total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Fly Airlines')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
    expect(screen.getByText('Visible Total: $340.50')).toBeInTheDocument()
  })

  it('filter All shows everything again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Fly Airlines')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $481.50')).toBeInTheDocument()
  })

  it('Summary shows correct Total Expenses count from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument()
  })

  it('Summary shows correct Monthly Total from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $481.50')).toBeInTheDocument()
  })

  it('Summary shows per-category totals from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Office: $120.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $340.50')).toBeInTheDocument()
    expect(screen.getByText('Software: $21.00')).toBeInTheDocument()
    expect(screen.getByText('Food: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Other: $0.00')).toBeInTheDocument()
  })

  it('adding an expense updates Summary Monthly Total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Uber', 'Travel', '55.00')
    await nav(u, 'Summary')
    // 481.50 + 55.00 = 536.50
    expect(screen.getByText('Monthly Total: $536.50')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses: 4')).toBeInTheDocument()
  })

  it('Summary is not affected by the category filter on Expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $481.50')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument()
  })

  it('deleting an expense updates Summary (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete fly airlines/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 2')).toBeInTheDocument()
    // 120.00 + 21.00 = 141.00
    expect(screen.getByText('Monthly Total: $141.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $0.00')).toBeInTheDocument()
  })

  it('toggles theme to dark and back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Expenses')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('expense list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '99.99')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('AWS')).toBeInTheDocument()
  })
})
