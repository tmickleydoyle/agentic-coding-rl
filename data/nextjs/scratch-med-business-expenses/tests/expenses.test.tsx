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

  it('shows Filtered Total of $0.00 with no expenses', () => {
    render(<App />)
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
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

  it('adds an expense and shows it formatted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Staples', 'Office', '25.50')
    expect(screen.getByText('Staples')).toBeInTheDocument()
    expect(screen.getByText('$25.50')).toBeInTheDocument()
  })

  it('ignores an expense with a blank vendor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Category'))
    await u.type(screen.getByLabelText('Category'), 'Office')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('ignores an expense with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Nobody', 'Misc', '0')
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('ignores an expense with a negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Nobody', 'Misc', '-5')
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('updates Filtered Total after adding expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Amazon', 'Office', '10.00')
    await addExpense(u, 'UPS', 'Shipping', '5.75')
    expect(screen.getByText('Filtered Total: $15.75')).toBeInTheDocument()
  })

  it('deletes an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'FedEx', 'Shipping', '8.00')
    await u.click(screen.getByRole('button', { name: /delete fedex/i }))
    expect(screen.queryByText('FedEx')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('filters by category and updates Filtered Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Walmart', 'Office', '20.00')
    await addExpense(u, 'DHL', 'Shipping', '12.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Office')
    expect(screen.getByText('Walmart')).toBeInTheDocument()
    expect(screen.queryByText('DHL')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $20.00')).toBeInTheDocument()
  })

  it('shows All restores full list and total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Walmart', 'Office', '20.00')
    await addExpense(u, 'DHL', 'Shipping', '12.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Shipping')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Walmart')).toBeInTheDocument()
    expect(screen.getByText('DHL')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $32.00')).toBeInTheDocument()
  })

  it('Summary shows Total and Expenses count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Costco', 'Supplies', '50.00')
    await addExpense(u, 'Office Depot', 'Office', '30.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $80.00')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 2')).toBeInTheDocument()
  })

  it('Summary shows per-category totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Costco', 'Supplies', '50.00')
    await addExpense(u, 'Staples', 'Supplies', '10.00')
    await addExpense(u, 'FedEx', 'Shipping', '7.50')
    await nav(u, 'Summary')
    expect(screen.getByText('Supplies: $60.00')).toBeInTheDocument()
    expect(screen.getByText('Shipping: $7.50')).toBeInTheDocument()
  })

  it('Summary shows $0.00 total with no expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 0')).toBeInTheDocument()
  })

  it('toggling theme changes data-theme attribute', async () => {
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

  it('expense list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'BP Gas', 'Travel', '45.00')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('BP Gas')).toBeInTheDocument()
    expect(screen.getByText('$45.00')).toBeInTheDocument()
  })

  it('Summary reflects deleted expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Acme', 'Office', '100.00')
    await addExpense(u, 'Beta', 'Office', '50.00')
    await u.click(screen.getByRole('button', { name: /delete acme/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $50.00')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 1')).toBeInTheDocument()
    expect(screen.getByText('Office: $50.00')).toBeInTheDocument()
  })

  it('filter dropdown contains correct category options', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'V1', 'Meals', '10')
    await addExpense(u, 'V2', 'Travel', '20')
    const select = screen.getByLabelText('Filter by category')
    const options = within(select as HTMLElement).getAllByRole('option')
    const texts = options.map((o) => o.textContent)
    expect(texts).toContain('All')
    expect(texts).toContain('Meals')
    expect(texts).toContain('Travel')
  })
})
