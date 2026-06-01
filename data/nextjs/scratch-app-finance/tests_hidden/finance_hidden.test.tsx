// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const budgets = () => screen.getByRole('region', { name: 'Budgets view' })

async function addTxn(u: U, desc: string, amount: string, category: string, type: string) {
  await u.clear(screen.getByLabelText(/description/i))
  await u.type(screen.getByLabelText(/description/i), desc)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), amount)
  await u.selectOptions(screen.getByLabelText(/category/i), category)
  await u.selectOptions(screen.getByLabelText(/^type$/i), type)
  await u.click(screen.getByRole('button', { name: /add transaction/i }))
}

describe('Budgeting (held-out)', () => {
  it('tracks Transport budget independently of Food', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Bus', '60', 'Transport', 'expense')
    await addTxn(u, 'Snack', '20', 'Food', 'expense')
    await nav(u, 'Budgets')
    expect(within(budgets()).getByText(/transport: \$60 of \$100/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food: \$20 of \$300/i)).toBeInTheDocument()
    expect(within(budgets()).queryByText(/over budget/i)).not.toBeInTheDocument()
  })

  it('rounds a negative savings rate when expenses exceed income', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Pay', '100', 'Salary', 'income')
    await addTxn(u, 'Spree', '150', 'Fun', 'expense')
    await nav(u, 'Reports')
    expect(screen.getByText(/balance: \$-50/i)).toBeInTheDocument()
    expect(screen.getByText(/savings rate: -50%/i)).toBeInTheDocument()
  })

  it('only expenses count toward a budget, not income in the same category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Refund', '500', 'Food', 'income')
    await addTxn(u, 'Meal', '40', 'Food', 'expense')
    await nav(u, 'Budgets')
    expect(within(budgets()).getByText(/food: \$40 of \$300/i)).toBeInTheDocument()
  })

  it('unchecking Show expenses only brings income rows back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Wage', '900', 'Salary', 'income')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show expenses only/i)) // hide
    await u.click(screen.getByLabelText(/show expenses only/i)) // show
    await nav(u, 'Transactions')
    expect(screen.getByText('Wage: +$900 (Salary)')).toBeInTheDocument()
  })
})
