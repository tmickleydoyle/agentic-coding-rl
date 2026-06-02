// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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
  it('Summary omits categories with no expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Software and Other have no seeded expenses
    expect(screen.queryByText(/^Software:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Other:/)).not.toBeInTheDocument()
  })

  it('adding two Software expenses accumulates in the category total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'AWS', 'Software', '50.00')
    await addExpense(u, 'GitHub', 'Software', '25.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $75.00')).toBeInTheDocument()
  })

  it('deleting one of two same-category expenses updates the category total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Hotel A', 'Travel', '100.00')
    await u.click(screen.getByRole('button', { name: 'Delete Fly High' }))
    await nav(u, 'Summary')
    // only Hotel A remains in Travel
    expect(screen.getByText('Travel: $100.00')).toBeInTheDocument()
  })

  it('filter by Food shows only Food expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Pizza Place', 'Food', '30.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.getByText('Lunch Spot')).toBeInTheDocument()
    expect(screen.getByText('Pizza Place')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Fly High')).not.toBeInTheDocument()
  })

  it('filter by Software shows empty list when no Software expenses exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    const items = screen.queryAllByRole('listitem')
    expect(items.length).toBe(0)
  })

  it('Summary count increases after adding an expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Parking Inc', 'Other', '5.50')
    await nav(u, 'Summary')
    expect(screen.getByText('Expenses: 4')).toBeInTheDocument()
  })

  it('Summary shows Other category after adding an Other expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Misc Store', 'Other', '12.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Other: $12.00')).toBeInTheDocument()
  })

  it('toggle theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary No expenses yet after clearing then adding shows new total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all expenses/i }))
    await nav(u, 'Expenses')
    await addExpense(u, 'New Vendor', 'Food', '9.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: $9.99')).toBeInTheDocument()
    expect(screen.getByText('Expenses: 1')).toBeInTheDocument()
    expect(screen.getByText('Food: $9.99')).toBeInTheDocument()
  })

  it('expense rows show category label', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const officeRow = items.find((li) => within(li).queryByText('Acme Corp'))
    expect(officeRow).toBeTruthy()
    expect(within(officeRow!).getByText('Office')).toBeInTheDocument()
  })

  it('negative amount is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Vendor'), 'Bad Vendor')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-10')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.queryByText('Bad Vendor')).not.toBeInTheDocument()
  })
})
