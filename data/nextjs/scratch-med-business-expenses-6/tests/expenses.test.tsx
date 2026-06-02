import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Business Expense Tracker', () => {
  it('starts on the Expenses view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('shows three seeded expenses on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Blue Bottle')).toBeInTheDocument()
    expect(screen.getByText('Delta Air')).toBeInTheDocument()
  })

  it('shows seeded amounts formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.getByText('$18.50')).toBeInTheDocument()
    expect(screen.getByText('$320.00')).toBeInTheDocument()
  })

  it('shows correct total for all seeded expenses', () => {
    render(<App />)
    expect(screen.getByText('Total: $388.49')).toBeInTheDocument()
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
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Staples')
    await u.selectOptions(screen.getByLabelText('Category'), 'Office')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '25.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Staples')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '10.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Total: $388.49')).toBeInTheDocument()
  })

  it('ignores an expense with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Ghost')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Total: $388.49')).toBeInTheDocument()
  })

  it('deletes an expense and updates total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete blue bottle/i }))
    expect(screen.queryByText('Blue Bottle')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $369.99')).toBeInTheDocument()
  })

  it('filters by category shows only matching expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    expect(screen.getByText('Delta Air')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Blue Bottle')).not.toBeInTheDocument()
  })

  it('filter shows correct category total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Meals')
    expect(screen.getByText('Total: $18.50')).toBeInTheDocument()
  })

  it('filter All restores all expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Total: $388.49')).toBeInTheDocument()
    expect(screen.getByText('Blue Bottle')).toBeInTheDocument()
  })

  it('Summary shows per-category totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $49.99')).toBeInTheDocument()
    expect(screen.getByText('Meals: $18.50')).toBeInTheDocument()
    expect(screen.getByText('Travel: $320.00')).toBeInTheDocument()
  })

  it('Summary shows grand total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Grand Total: $388.49')).toBeInTheDocument()
  })

  it('Summary shows expense count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Expense Count: 3')).toBeInTheDocument()
  })

  it('Summary updates after adding an expense (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Zoom')
    await u.selectOptions(screen.getByLabelText('Category'), 'Software')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '15.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $64.99')).toBeInTheDocument()
    expect(screen.getByText('Grand Total: $403.49')).toBeInTheDocument()
    expect(screen.getByText('Expense Count: 4')).toBeInTheDocument()
  })

  it('Summary updates after deleting an expense (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete delta air/i }))
    await nav(u, 'Summary')
    expect(screen.queryByText('Travel: $320.00')).not.toBeInTheDocument()
    expect(screen.getByText('Grand Total: $68.49')).toBeInTheDocument()
    expect(screen.getByText('Expense Count: 2')).toBeInTheDocument()
  })

  it('theme toggle switches data-theme attribute', async () => {
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
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Expenses')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('expense list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Persisted Vendor')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '5.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    await nav(u, 'Settings')
    await nav(u, 'Expenses')
    expect(screen.getByText('Persisted Vendor')).toBeInTheDocument()
  })
})
