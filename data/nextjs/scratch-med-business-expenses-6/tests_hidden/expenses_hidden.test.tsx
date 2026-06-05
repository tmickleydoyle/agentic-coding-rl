// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Business Expense Tracker (held-out)', () => {
  it('seeded categories appear in the Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Only categories with at least one expense should appear
    expect(screen.queryByText(/Office:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Other:/)).not.toBeInTheDocument()
    expect(screen.getByText('Software: $49.99')).toBeInTheDocument()
  })

  it('adding an Office expense makes it appear in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'FedEx')
    await u.selectOptions(screen.getByLabelText('Category'), 'Office')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '12.75')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Office: $12.75')).toBeInTheDocument()
  })

  it('filter by Software shows only Software expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Software')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Delta Air')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $49.99')).toBeInTheDocument()
  })

  it('filter by Office with no matching expenses shows $0.00 total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Office')
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('deleting all expenses shows $0.00 grand total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete blue bottle/i }))
    await u.click(screen.getByRole('button', { name: /delete delta air/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Grand Total: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Expense Count: 0')).toBeInTheDocument()
  })

  it('multiple expenses in same category sum correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'GitHub')
    await u.selectOptions(screen.getByLabelText('Category'), 'Software')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '10.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Software: $59.99')).toBeInTheDocument()
  })

  it('expense count increments with each addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'Uber')
    await u.selectOptions(screen.getByLabelText('Category'), 'Travel')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '22.00')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Expense Count: 4')).toBeInTheDocument()
    expect(screen.getByText('Travel: $342.00')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter state persists when navigating to Summary and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Travel')
    await nav(u, 'Summary')
    await nav(u, 'Expenses')
    expect(screen.getByText('Total: $320.00')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('negative amount is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Vendor'))
    await u.type(screen.getByLabelText('Vendor'), 'BadEntry')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-5')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByText('Total: $388.49')).toBeInTheDocument()
    expect(screen.queryByText('BadEntry')).not.toBeInTheDocument()
  })
})
