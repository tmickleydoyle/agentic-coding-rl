import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExpense(u: U, vendor: string, amount: string, category: string) {
  await u.clear(screen.getByLabelText('Vendor'))
  await u.type(screen.getByLabelText('Vendor'), vendor)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.selectOptions(screen.getByLabelText('Category'), category)
  await u.click(screen.getByRole('button', { name: /add expense/i }))
}

describe('Business Expense Tracker (held-out)', () => {
  it('filter by Food only shows Lunch Spot in seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.getByText('Lunch Spot')).toBeInTheDocument()
    expect(screen.queryByText('Jet Airways')).not.toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filtered total for Food matches seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.getByText('Filtered Total: $18.75')).toBeInTheDocument()
  })

  it('adding two Software expenses shows combined category total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', '99.00', 'Software')
    await addExpense(u, 'GitHub', '21.00', 'Software')
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $120.00')).toBeInTheDocument()
  })

  it('Summary Total Expenses increments correctly after adding expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Vendor X', '10.00', 'Other')
    await addExpense(u, 'Vendor Y', '20.00', 'Other')
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 5')).toBeInTheDocument()
  })

  it('ignores zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Zero Corp')
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Zero Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $263.75')).toBeInTheDocument()
  })

  it('ignores negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Negative Inc')
    await u.type(screen.getByLabelText('Amount'), '-10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Negative Inc')).not.toBeInTheDocument()
  })

  it('after clear, adding a new expense shows correct Monthly Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    await nav(u, 'Expenses')
    await addExpense(u, 'Fresh Start', '55.00', 'Supplies')
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $55.00')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses: 1')).toBeInTheDocument()
    expect(screen.getByText('Supplies: $55.00')).toBeInTheDocument()
  })

  it('filter state is local to Expenses and does not affect Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $263.75')).toBeInTheDocument()
  })

  it('filter by Other shows no results from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Other')
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
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

  it('newly added expense appears in filtered list when category matches', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta Airlines', '350.00', 'Travel')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument()
    expect(screen.getByText('$350.00')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $550.00')).toBeInTheDocument()
  })

  it('newly added expense does not appear under wrong category filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Paper Plus', '12.00', 'Supplies')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.queryByText('Paper Plus')).not.toBeInTheDocument()
  })
})
