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

describe('Business Expense Tracker', () => {
  it('starts on the Expenses view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('shows seed expenses on initial load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Jet Airways')).toBeInTheDocument()
    expect(screen.getByText('Lunch Spot')).toBeInTheDocument()
  })

  it('shows seed expense amounts formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(screen.getByText('$18.75')).toBeInTheDocument()
  })

  it('shows Filtered Total for all seed expenses', () => {
    render(<App />)
    expect(screen.getByText('Filtered Total: $263.75')).toBeInTheDocument()
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

  it('adds a new expense and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Office Depot', '32.50', 'Supplies')
    expect(screen.getByText('Office Depot')).toBeInTheDocument()
    expect(screen.getByText('$32.50')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Amount'), '50')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Filtered Total: $263.75')).toBeInTheDocument()
  })

  it('ignores an expense with an invalid amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Ghost Vendor')
    await u.type(screen.getByLabelText('Amount'), 'abc')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Ghost Vendor')).not.toBeInTheDocument()
  })

  it('filters list by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Jet Airways')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Lunch Spot')).not.toBeInTheDocument()
  })

  it('shows correct Filtered Total when filtered by Travel', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Filtered Total: $200.00')).toBeInTheDocument()
  })

  it('shows correct Filtered Total when filtered by Supplies', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Supplies')
    expect(screen.getByText('Filtered Total: $45.00')).toBeInTheDocument()
  })

  it('shows all expenses again after resetting filter to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Filtered Total: $263.75')).toBeInTheDocument()
  })

  it('Summary shows correct Monthly Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $263.75')).toBeInTheDocument()
  })

  it('Summary shows correct Total Expenses count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument()
  })

  it('Summary shows per-category totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Supplies: $45.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $200.00')).toBeInTheDocument()
    expect(screen.getByText('Food: $18.75')).toBeInTheDocument()
  })

  it('Summary does not show categories with no expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.queryByText(/Software:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Other:/)).not.toBeInTheDocument()
  })

  it('adding an expense updates Summary Monthly Total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Cloud Co', '50.00', 'Software')
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $313.75')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses: 4')).toBeInTheDocument()
    expect(screen.getByText('Software: $50.00')).toBeInTheDocument()
  })

  it('Clear all expenses removes all entries (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    await nav(u, 'Expenses')
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('Clear all expenses resets Summary to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Monthly Total: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Expenses')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('expense list state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Persistent Vendor', '77.00', 'Other')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Persistent Vendor')).toBeInTheDocument()
  })
})
