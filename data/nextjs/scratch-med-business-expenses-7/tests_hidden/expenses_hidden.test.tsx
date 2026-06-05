// HELD-OUT generalization tests — fresh scenarios not in the visible suite.
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

describe('Business Expense Tracker (held-out)', () => {
  it('multiple expenses in the same category sum correctly in filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Office Depot', 'Office', '45.00')
    await addExpense(u, 'Staples', 'Office', '22.75')
    await addExpense(u, 'Uber', 'Travel', '18.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Office')
    expect(screen.getByText('Showing: 2 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $67.75')).toBeInTheDocument()
  })

  it('filter shows 0 expenses for a category with no entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Starbucks', 'Food', '8.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Travel')
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('deleting a filtered item keeps filter active and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '50.00')
    await addExpense(u, 'GitHub', 'Software', '10.00')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Software')
    await u.click(screen.getByRole('button', { name: /delete aws/i }))
    expect(screen.getByText('Showing: 1 expenses')).toBeInTheDocument()
    expect(screen.getByText('Total: $10.00')).toBeInTheDocument()
  })

  it('Summary per-category total updates after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Lyft', 'Travel', '15.00')
    await addExpense(u, 'Uber', 'Travel', '25.00')
    await u.click(screen.getByRole('button', { name: /delete lyft/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Travel: $25.00')).toBeInTheDocument()
    expect(screen.getByText('Grand total: $25.00')).toBeInTheDocument()
  })

  it('amount formatted to two decimal places for whole numbers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Notion', 'Software', '16')
    expect(screen.getByText('$16.00')).toBeInTheDocument()
  })

  it('Summary Other category appears when an Other expense exists', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Miscellaneous', 'Other', '9.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Other: $9.99')).toBeInTheDocument()
  })

  it('ignores a negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^vendor$/i), 'Bad Entry')
    await u.clear(screen.getByLabelText(/^amount$/i))
    await u.type(screen.getByLabelText(/^amount$/i), '-5')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Showing: 0 expenses')).toBeInTheDocument()
  })

  it('theme toggle cycles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding then navigating to Summary and back preserves expense list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Zoom', 'Software', '14.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Total expenses: 1')).toBeInTheDocument()
    await nav(u, 'Expenses')
    expect(screen.getByText('Zoom')).toBeInTheDocument()
    expect(screen.getByText('Total: $14.99')).toBeInTheDocument()
  })
})
