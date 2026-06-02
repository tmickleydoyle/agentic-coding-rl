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
  it('starts on the Expenses view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Fly High')).toBeInTheDocument()
    expect(screen.getByText('Lunch Spot')).toBeInTheDocument()
  })

  it('shows seeded amounts formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(screen.getByText('$320.50')).toBeInTheDocument()
    expect(screen.getByText('$18.75')).toBeInTheDocument()
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

  it('navigates back to Expenses view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('adds a new expense and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Cloud Co', 'Software', '99.99')
    expect(screen.getByText('Cloud Co')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Amount'), '50')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    // still only 3 seeded items visible
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(3)
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
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters expenses by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Fly High')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Lunch Spot')).not.toBeInTheDocument()
  })

  it('shows all expenses when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Fly High')).toBeInTheDocument()
    expect(screen.getByText('Lunch Spot')).toBeInTheDocument()
  })

  it('Summary shows total of seeded expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // 45.00 + 320.50 + 18.75 = 384.25
    expect(screen.getByText('Total: $384.25')).toBeInTheDocument()
  })

  it('Summary shows count of seeded expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Expenses: 3')).toBeInTheDocument()
  })

  it('Summary shows per-category totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Office: $45.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $320.50')).toBeInTheDocument()
    expect(screen.getByText('Food: $18.75')).toBeInTheDocument()
  })

  it('Summary total updates after adding an expense (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Pen World', 'Office', '10.00')
    await nav(u, 'Summary')
    // 384.25 + 10.00 = 394.25
    expect(screen.getByText('Total: $394.25')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 4')).toBeInTheDocument()
  })

  it('Summary reflects deletion cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Fly High' }))
    await nav(u, 'Summary')
    // 45.00 + 18.75 = 63.75
    expect(screen.getByText('Total: $63.75')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 2')).toBeInTheDocument()
  })

  it('Summary filter does not affect Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    await nav(u, 'Summary')
    // still all 3 expenses in summary
    expect(screen.getByText('Total: $384.25')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 3')).toBeInTheDocument()
  })

  it('Clear all expenses shows No expenses yet in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    expect(screen.getByText('No expenses yet')).toBeInTheDocument()
  })

  it('after clearing, Expenses view shows empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    await nav(u, 'Expenses')
    const items = screen.queryAllByRole('listitem')
    expect(items.length).toBe(0)
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
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
    await addExpense(u, 'Staples Inc', 'Office', '22.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Staples Inc')).toBeInTheDocument()
  })
})
