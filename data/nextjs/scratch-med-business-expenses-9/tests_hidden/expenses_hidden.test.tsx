import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Business Expense Tracker (held-out)', () => {
  it('filter with no match shows $0.00 filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'NoSuchCategory')
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
  })

  it('adding an expense clears input fields', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'GitHub', 'Software', '21.00')
    expect(screen.getByLabelText('Vendor')).toHaveValue('')
    expect(screen.getByLabelText('Category')).toHaveValue('')
  })

  it('negative amount is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'BadVendor', 'Office', '-50')
    expect(screen.queryByText('BadVendor')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered total: $1165.50')).toBeInTheDocument()
  })

  it('filter is case-insensitive for Travel category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'TRAVEL')
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument()
    expect(screen.queryByText('Staples')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered total: $320.50')).toBeInTheDocument()
  })

  it('Summary shows a new category after adding expense in new category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Zoom', 'Software', '15.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $15.00')).toBeInTheDocument()
  })

  it('Summary total is not affected by filter state on Expenses view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'Office')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $1165.50')).toBeInTheDocument()
  })

  it('deleting all expenses makes Summary show $0.00 total and 0 count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete staples/i }))
    await u.click(screen.getByRole('button', { name: /delete delta airlines/i }))
    await u.click(screen.getByRole('button', { name: /delete wework/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 0')).toBeInTheDocument()
  })

  it('adding two expenses in same new category sums them in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Adobe', 'Software', '54.99')
    await addExpense(u, 'Figma', 'Software', '45.01')
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $100.00')).toBeInTheDocument()
  })

  it('toggles theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter state does not persist to Summary expense count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Summary')
    expect(screen.getByText('Expenses: 3')).toBeInTheDocument()
  })
})
