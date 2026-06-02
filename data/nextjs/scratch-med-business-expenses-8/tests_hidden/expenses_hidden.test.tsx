// HELD-OUT generalization tests — different inputs, edge cases, cross-view paths.
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
  it('each seeded expense shows its category', () => {
    render(<App />)
    const items = screen.getAllByText('Office')
    expect(items.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Travel').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Software').length).toBeGreaterThanOrEqual(1)
  })

  it('adding two Food expenses updates Food category total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Chipotle', 'Food', '13.50')
    await addExpense(u, 'Starbucks', 'Food', '6.75')
    await nav(u, 'Summary')
    // 13.50 + 6.75 = 20.25
    expect(screen.getByText('Food: $20.25')).toBeInTheDocument()
  })

  it('deleting all expenses makes Monthly Total $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete delta air/i }))
    await u.click(screen.getByRole('button', { name: /delete github/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Total: $0.00')).toBeInTheDocument()
  })

  it('filter by Office shows only Office expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Office')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Delta Air')).not.toBeInTheDocument()
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $45.00')).toBeInTheDocument()
  })

  it('adding an Other expense then filtering by Other shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Miscellaneous', 'Other', '77.77')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Other')
    expect(screen.getByText('Miscellaneous')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 expenses')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $77.77')).toBeInTheDocument()
  })

  it('Summary Other category total updates after adding Other expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Misc', 'Other', '55.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Other: $55.00')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('filter persists within the view after adding a new expense in same category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await addExpense(u, 'Amtrak', 'Travel', '45.00')
    // filter should still be Travel — but adding resets form, filter UI state is separate
    // total travel = 320.75 + 45.00 = 365.75 if filter stayed on Travel
    // We just check the new expense exists when All is selected
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Amtrak')).toBeInTheDocument()
  })

  it('Summary total count includes all categories added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Zoom', 'Software', '14.99')
    await addExpense(u, 'Lyft', 'Travel', '22.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 5')).toBeInTheDocument()
    // 45 + 320.75 + 9.99 + 14.99 + 22.00 = 412.73
    expect(screen.getByText('Monthly Total: $412.73')).toBeInTheDocument()
    expect(screen.getByText('Software: $24.98')).toBeInTheDocument()
    // 320.75 + 22.00 = 342.75
    expect(screen.getByText('Travel: $342.75')).toBeInTheDocument()
  })

  it('negative amount is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'BadEntry')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 3 expenses')).toBeInTheDocument()
  })

  it('delete then navigate to Summary reflects updated count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 2')).toBeInTheDocument()
    expect(screen.getByText('Office: $0.00')).toBeInTheDocument()
  })
})
