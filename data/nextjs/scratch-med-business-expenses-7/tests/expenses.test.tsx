import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExpense(u: U, vendor: string, category: string, amount: string) {
  await u.clear(screen.getByLabelText(/^vendor$/i))
  await u.type(screen.getByLabelText(/^vendor$/i), vendor)
  await u.selectOptions(screen.getByLabelText(/^category$/i), category)
  await u.clear(screen.getByLabelText(/^amount$/i))
  await u.type(screen.getByLabelText(/^amount$/i), amount)
  await u.click(screen.getByRole('button', { name: /add expense/i }))
}

describe('Business Expense Tracker', () => {
  it('starts on the Expenses view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Expenses' })).toBeInTheDocument()
  })

  it('shows zero expenses and $0.00 total on load', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
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

  it('adds an expense and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '12.50')
    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.getByText('$12.50')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $12.50')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^amount$/i))
    await u.type(screen.getByLabelText(/^amount$/i), '20')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
  })

  it('ignores an expense with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^vendor$/i), 'Ghost')
    await u.clear(screen.getByLabelText(/^amount$/i))
    await u.type(screen.getByLabelText(/^amount$/i), '0')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
  })

  it('deletes an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Uber', 'Travel', '30.00')
    expect(screen.getByText('Uber')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete uber/i }))
    expect(screen.queryByText('Uber')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('filters expenses by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '10.00')
    await addExpense(u, 'Uber', 'Travel', '25.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Food')
    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.queryByText('Uber')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $10.00')).toBeInTheDocument()
  })

  it('filter All shows all expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '10.00')
    await addExpense(u, 'Uber', 'Travel', '25.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Travel')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'All')
    expect(screen.getByText('Showing: 2 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $35.00')).toBeInTheDocument()
  })

  it('filtered total updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '99.99')
    await addExpense(u, 'GitHub', 'Software', '4.00')
    await addExpense(u, 'Lyft', 'Travel', '18.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Software')
    expect(screen.getByText('Showing: 2 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $103.99')).toBeInTheDocument()
  })

  it('Summary shows total expenses count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '5.00')
    await addExpense(u, 'Uber', 'Travel', '20.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 2')).toBeInTheDocument()
  })

  it('Summary shows grand total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '12.50')
    await addExpense(u, 'Uber', 'Travel', '30.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Grand total: $42.50')).toBeInTheDocument()
  })

  it('Summary shows per-category totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '12.50')
    await addExpense(u, 'Pret', 'Food', '7.50')
    await addExpense(u, 'Uber', 'Travel', '30.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Food: $20.00')).toBeInTheDocument()
    expect(screen.getByText('Travel: $30.00')).toBeInTheDocument()
  })

  it('Summary omits categories with no expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '5.00')
    await nav(u, 'Summary')
    expect(screen.queryByText(/^Travel:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Software:/)).not.toBeInTheDocument()
  })

  it('deleting an expense updates Summary (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '10.00')
    await addExpense(u, 'Uber', 'Travel', '20.00')
    await u.click(screen.getByRole('button', { name: /delete uber/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 1')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $10.00')).toBeInTheDocument()
    expect(screen.queryByText(/^Travel:/)).not.toBeInTheDocument()
  })

  it('Summary shows zero total expenses on empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 0')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $0.00')).toBeInTheDocument()
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

  it('expenses persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Notion', 'Software', '16.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Notion')).toBeInTheDocument()
    expect(screen.getByText('Total: $16.00')).toBeInTheDocument()
  })

  it('each expense row displays vendor, category and formatted amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta Airlines', 'Travel', '350.00')
    const list = screen.getByRole('list')
    const item = within(list).getByText('Delta Airlines').closest('li') as HTMLElement
    expect(within(item).getByText('Travel')).toBeInTheDocument()
    expect(within(item).getByText('$350.00')).toBeInTheDocument()
  })
})
