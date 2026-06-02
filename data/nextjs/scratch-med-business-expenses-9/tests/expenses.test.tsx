import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExpense(u: U, vendor: string, category: string, amount: string) {
  await u.clear(screen.getByLabelText('Vendor'))
  await u.type(screen.getByLabelText('Vendor'), vendor)
  await u.clear(screen.getByLabelText('Category'))
  await u.type(screen.getByLabelText('Category'), category)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.click(screen.getByRole('button', { name: /add expense/i }))
}

describe('Business Expense Tracker', () => {
  it('starts on the Expenses view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
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

  it('shows seeded expenses on load', () => {
    render(<App />)
    expect(screen.getByText('Staples')).toBeInTheDocument()
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument()
    expect(screen.getByText('WeWork')).toBeInTheDocument()
  })

  it('shows seeded amounts formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$45.00')).toBeInTheDocument()
    expect(screen.getByText('$320.50')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('shows correct filtered total for all seeded expenses', () => {
    render(<App />)
    expect(screen.getByText('Filtered total: $1165.50')).toBeInTheDocument()
  })

  it('adds a new expense and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Amazon', 'Supplies', '99.99')
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('ignores blank vendor on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Category'), 'Office')
    await u.type(screen.getByLabelText('Amount'), '10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Filtered total: $1165.50')).toBeInTheDocument()
  })

  it('ignores blank category on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'SomeVendor')
    await u.clear(screen.getByLabelText('Category'))
    await u.type(screen.getByLabelText('Amount'), '10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('ignores zero amount on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Ghost')
    await u.type(screen.getByLabelText('Category'), 'Office')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Ghost')).not.toBeInTheDocument()
  })

  it('deletes an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete staples/i }))
    expect(screen.queryByText('Staples')).not.toBeInTheDocument()
  })

  it('updates filtered total after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete delta airlines/i }))
    expect(screen.getByText('Filtered total: $845.00')).toBeInTheDocument()
  })

  it('filters by category (case-insensitive)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'office')
    expect(screen.getByText('Staples')).toBeInTheDocument()
    expect(screen.getByText('WeWork')).toBeInTheDocument()
    expect(screen.queryByText('Delta Airlines')).not.toBeInTheDocument()
  })

  it('shows correct filtered total for Office category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'Office')
    expect(screen.getByText('Filtered total: $845.00')).toBeInTheDocument()
  })

  it('shows correct filtered total for Travel category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Filtered total: $320.50')).toBeInTheDocument()
  })

  it('clearing filter shows all expenses again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'Office')
    await u.clear(screen.getByLabelText('Filter by category'))
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument()
    expect(screen.getByText('Filtered total: $1165.50')).toBeInTheDocument()
  })

  it('Summary shows total of all seeded expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $1165.50')).toBeInTheDocument()
  })

  it('Summary shows expense count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Expenses: 3')).toBeInTheDocument()
  })

  it('Summary shows per-category totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Office: $845.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $320.50')).toBeInTheDocument()
  })

  it('Summary updates when a new expense is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Uber', 'Travel', '55.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $1220.50')).toBeInTheDocument()
    expect(screen.getByText('Travel: $375.50')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 4')).toBeInTheDocument()
  })

  it('Summary updates when an expense is deleted (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete wework/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $365.50')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 2')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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
    await addExpense(u, 'Notion', 'Software', '16.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Notion')).toBeInTheDocument()
  })
})
