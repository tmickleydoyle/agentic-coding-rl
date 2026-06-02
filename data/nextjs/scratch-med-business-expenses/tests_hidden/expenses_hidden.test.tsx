// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Business Expense Tracker (held-out)', () => {
  it('three expenses across two categories sum correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '200.00')
    await addExpense(u, 'Hilton', 'Travel', '150.00')
    await addExpense(u, 'Adobe', 'Software', '55.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $405.00')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 3')).toBeInTheDocument()
    expect(screen.getByText('Travel: $350.00')).toBeInTheDocument()
    expect(screen.getByText('Software: $55.00')).toBeInTheDocument()
  })

  it('filtering by a second category shows correct subset and total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Slack', 'Software', '15.00')
    await addExpense(u, 'Zoom', 'Software', '14.99')
    await addExpense(u, 'Uber', 'Travel', '22.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    expect(screen.getByText('Filtered Total: $29.99')).toBeInTheDocument()
    expect(screen.queryByText('Uber')).not.toBeInTheDocument()
  })

  it('deleting all expenses of one category removes it from the filter dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Solo', 'Misc', '5.00')
    await u.click(screen.getByRole('button', { name: /delete solo/i }))
    const select = screen.getByLabelText('Filter by category')
    const options = within(select as HTMLElement).getAllByRole('option')
    const texts = options.map((o) => o.textContent)
    expect(texts).not.toContain('Misc')
  })

  it('ignores an expense with a blank category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Acme')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Filtered Total: $0.00')).toBeInTheDocument()
  })

  it('multiple deletes keep Filtered Total accurate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'A', 'Food', '10.00')
    await addExpense(u, 'B', 'Food', '20.00')
    await addExpense(u, 'C', 'Food', '30.00')
    await u.click(screen.getByRole('button', { name: /delete b/i }))
    expect(screen.getByText('Filtered Total: $40.00')).toBeInTheDocument()
  })

  it('Summary updates immediately after adding a new expense cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Dropbox', 'Software', '9.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $9.99')).toBeInTheDocument()
    await nav(u, 'Expenses')
    await addExpense(u, 'GitHub', 'Software', '4.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $13.99')).toBeInTheDocument()
    expect(screen.getByText('Software: $13.99')).toBeInTheDocument()
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

  it('filter shows only All option when no expenses exist', () => {
    render(<App />)
    const select = screen.getByLabelText('Filter by category')
    const options = within(select as HTMLElement).getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0].textContent).toBe('All')
  })

  it('amount with cents rounds to two decimal places in display', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Corner Store', 'Meals', '7.30')
    expect(screen.getByText('$7.30')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $7.30')).toBeInTheDocument()
  })
})
