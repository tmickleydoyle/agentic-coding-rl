// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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
  it('visible total with Office filter only shows office expenses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Office')
    expect(screen.getByText('Visible Total: $120.00')).toBeInTheDocument()
  })

  it('adding two Food expenses sums correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Pizza Place', 'Food', '18.00')
    await addExpense(u, 'Sandwich Co', 'Food', '9.75')
    await nav(u, 'Summary')
    // 18.00 + 9.75 = 27.75
    expect(screen.getByText('Food: $27.75')).toBeInTheDocument()
  })

  it('Summary Total Expenses updates after adding multiple', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Vendor A', 'Other', '10.00')
    await addExpense(u, 'Vendor B', 'Other', '20.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 5')).toBeInTheDocument()
  })

  it('filter Software shows only software vendors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Fly Airlines')).not.toBeInTheDocument()
  })

  it('filter Food on empty category shows Visible Total: $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Food')
    expect(screen.getByText('Visible Total: $0.00')).toBeInTheDocument()
  })

  it('visible total updates when a filtered expense is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Delta', 'Travel', '200.00')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    // 340.50 + 200.00 = 540.50
    expect(screen.getByText('Visible Total: $540.50')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete fly airlines/i }))
    expect(screen.getByText('Visible Total: $200.00')).toBeInTheDocument()
  })

  it('Summary Other total reflects newly added Other expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Misc Supplies', 'Other', '45.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Other: $45.00')).toBeInTheDocument()
  })

  it('deleting all expenses shows Monthly Total: $0.00 in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete fly airlines/i }))
    await u.click(screen.getByRole('button', { name: /delete github/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Total: $0.00')).toBeInTheDocument()
  })

  it('filter persists when navigating to settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Settings')
    await nav(u, 'Expenses')
    expect(screen.getByText('Visible Total: $340.50')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('Summary Software total updates after adding new software expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExpense(u, 'Figma', 'Software', '15.00')
    await nav(u, 'Summary')
    // 21.00 + 15.00 = 36.00
    expect(screen.getByText('Software: $36.00')).toBeInTheDocument()
  })

  it('expense row shows vendor, category and formatted amount together', () => {
    render(<App />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    const acme = items.find((li) => within(li).queryByText('Acme Corp'))
    expect(acme).toBeTruthy()
    expect(within(acme!).getByText('Office')).toBeInTheDocument()
    expect(within(acme!).getByText('$120.00')).toBeInTheDocument()
  })
})
