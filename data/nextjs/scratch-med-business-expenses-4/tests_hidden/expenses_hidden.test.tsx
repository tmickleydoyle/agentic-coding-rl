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

describe('Business Expense Tracker (held-out)', () => {
  it('multiple expenses in the same category sum correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Marriott', 'Travel', '180.00')
    await addExpense(u, 'United Airlines', 'Travel', '320.50')
    await nav(u, 'Summary')
    expect(screen.getByText('Travel: $500.50')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $500.50')).toBeInTheDocument()
    expect(screen.getByText('Total expenses: 2')).toBeInTheDocument()
  })

  it('expenses across multiple categories each appear in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Chipotle', 'Food', '13.50')
    await addExpense(u, 'GitHub', 'Software', '21.00')
    await addExpense(u, 'Staples', 'Office', '44.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Food: $13.50')).toBeInTheDocument()
    expect(screen.getByText('Software: $21.00')).toBeInTheDocument()
    expect(screen.getByText('Office: $44.99')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $79.49')).toBeInTheDocument()
  })

  it('filter to Other category and check total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Misc Shop', 'Other', '7.25')
    await addExpense(u, 'Delta', 'Travel', '150.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Other')
    expect(screen.getByText('Showing total: $7.25')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('ignores expense with negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Bad Entry')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-5')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back to Expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '200.00')
    await addExpense(u, 'Wendy\'s', 'Food', '9.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Wendy\'s')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $9.00')).toBeInTheDocument()
  })

  it('Summary total count increases with each added expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 0')).toBeInTheDocument()
    await nav(u, 'Expenses')
    await addExpense(u, 'Netflix', 'Software', '15.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 1')).toBeInTheDocument()
    await nav(u, 'Expenses')
    await addExpense(u, 'Lyft', 'Travel', '12.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Office category expense appears with correct amount formatting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'IKEA', 'Office', '199.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Office: $199.00')).toBeInTheDocument()
  })
})
