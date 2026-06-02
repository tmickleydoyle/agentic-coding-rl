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

  it('shows No expenses found and $0.00 total on empty state', () => {
    render(<App />)
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Expenses')
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('adds an expense and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '12.50')
    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.getByText('$12.50')).toBeInTheDocument()
    expect(screen.queryByText('No expenses found')).not.toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
  })

  it('ignores an expense with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Test Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
  })

  it('shows the correct showing total for one expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '99.99')
    expect(screen.getByText('Showing total: $99.99')).toBeInTheDocument()
  })

  it('shows the correct showing total for multiple expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '50.00')
    await addExpense(u, 'Notion', 'Software', '16.00')
    expect(screen.getByText('Showing total: $66.00')).toBeInTheDocument()
  })

  it('filters expenses by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '300.00')
    await addExpense(u, 'Starbucks', 'Food', '8.75')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.queryByText('Starbucks')).not.toBeInTheDocument()
  })

  it('shows filtered total when a category filter is applied', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '300.00')
    await addExpense(u, 'Starbucks', 'Food', '8.75')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Showing total: $300.00')).toBeInTheDocument()
  })

  it('shows No expenses found when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '50.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('restores all expenses when filter is set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '300.00')
    await addExpense(u, 'Starbucks', 'Food', '8.75')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Delta')).toBeInTheDocument()
    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.getByText('Showing total: $308.75')).toBeInTheDocument()
  })

  it('Summary shows zero state correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 0')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $0.00')).toBeInTheDocument()
  })

  it('Summary reflects expenses added on Expenses view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '50.00')
    await addExpense(u, 'Notion', 'Software', '16.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 2')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $66.00')).toBeInTheDocument()
    expect(screen.getByText('Software: $66.00')).toBeInTheDocument()
  })

  it('Summary shows per-category totals only for categories with expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '200.00')
    await addExpense(u, 'Starbucks', 'Food', '15.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Travel: $200.00')).toBeInTheDocument()
    expect(screen.getByText('Food: $15.00')).toBeInTheDocument()
    expect(screen.queryByText(/Software:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Office:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Other:/)).not.toBeInTheDocument()
  })

  it('Summary grand total ignores the Expenses filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '100.00')
    await addExpense(u, 'Starbucks', 'Food', '25.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: $125.00')).toBeInTheDocument()
    expect(screen.getByText('Total expenses: 2')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Expenses')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('expense list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Uber', 'Travel', '22.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Uber')).toBeInTheDocument()
    expect(screen.getByText('Showing total: $22.00')).toBeInTheDocument()
  })

  it('each expense row shows vendor, category and formatted amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Office Depot', 'Office', '45.99')
    const list = screen.getByRole('list')
    const item = within(list).getByText('Office Depot').closest('li') as HTMLElement
    expect(within(item).getByText('Office')).toBeInTheDocument()
    expect(within(item).getByText('$45.99')).toBeInTheDocument()
  })
})
