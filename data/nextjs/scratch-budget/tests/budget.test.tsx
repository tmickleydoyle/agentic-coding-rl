import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

function budgets(): HTMLElement {
  return screen.getByRole('region', { name: 'Budgets' })
}
function txList(): HTMLElement {
  return screen.getByRole('region', { name: 'Transactions' })
}
async function setFilter(u: U, value: string) {
  await u.selectOptions(screen.getByLabelText(/filter month/i), value)
}
async function addTx(
  u: U,
  t: { type: string; description: string; category: string; amount: string; month: string },
) {
  await u.selectOptions(screen.getByLabelText(/^type$/i), t.type)
  await u.clear(screen.getByLabelText(/description/i))
  await u.type(screen.getByLabelText(/description/i), t.description)
  await u.selectOptions(screen.getByLabelText(/^category$/i), t.category)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), t.amount)
  await u.selectOptions(screen.getByLabelText(/^month$/i), t.month)
  await u.click(screen.getByRole('button', { name: /add transaction/i }))
}

describe('Budget tracker', () => {
  it('shows the all-scope balance', () => {
    render(<App />)
    expect(screen.getByText(/balance: \$1950\.00/i)).toBeInTheDocument()
  })

  it('scopes the balance and category totals to January, flagging over-budget', async () => {
    const u = userEvent.setup()
    render(<App />)
    await setFilter(u, 'January')
    expect(screen.getByText(/balance: \$1490\.00/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food: \$370\.00 of \$300\.00/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food over budget/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/transport: \$60\.00 of \$100\.00/i)).toBeInTheDocument()
    expect(within(budgets()).queryByText(/transport over budget/i)).not.toBeInTheDocument()
  })

  it('scopes to February with no over-budget categories', async () => {
    const u = userEvent.setup()
    render(<App />)
    await setFilter(u, 'February')
    expect(screen.getByText(/balance: \$460\.00/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food: \$40\.00 of \$300\.00/i)).toBeInTheDocument()
    expect(within(budgets()).queryByText(/food over budget/i)).not.toBeInTheDocument()
  })

  it('filters the transaction list by month', async () => {
    const u = userEvent.setup()
    render(<App />)
    await setFilter(u, 'January')
    expect(within(txList()).getByText(/groceries/i)).toBeInTheDocument()
    expect(within(txList()).queryByText(/snacks/i)).not.toBeInTheDocument()
    await setFilter(u, 'February')
    expect(within(txList()).getByText(/snacks/i)).toBeInTheDocument()
    expect(within(txList()).queryByText(/groceries/i)).not.toBeInTheDocument()
  })

  it('adds an expense that pushes a category over budget', async () => {
    const u = userEvent.setup()
    render(<App />)
    await setFilter(u, 'February')
    await addTx(u, {
      type: 'expense',
      description: 'Big dinner',
      category: 'Food',
      amount: '300',
      month: 'February',
    })
    expect(within(budgets()).getByText(/food: \$340\.00 of \$300\.00/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food over budget/i)).toBeInTheDocument()
    expect(screen.getByText(/balance: \$160\.00/i)).toBeInTheDocument()
  })

  it('adds income that raises the balance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTx(u, {
      type: 'income',
      description: 'Bonus',
      category: 'Salary',
      amount: '1000',
      month: 'January',
    })
    expect(screen.getByText(/balance: \$2950\.00/i)).toBeInTheDocument()
  })

  it('ignores a non-positive amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTx(u, {
      type: 'expense',
      description: 'Bad',
      category: 'Food',
      amount: '0',
      month: 'January',
    })
    expect(screen.getByText(/balance: \$1950\.00/i)).toBeInTheDocument()
    expect(within(txList()).queryByText(/bad/i)).not.toBeInTheDocument()
  })

  it('keeps the all-scope balance after switching filters back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await setFilter(u, 'January')
    await setFilter(u, 'All')
    expect(screen.getByText(/balance: \$1950\.00/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food: \$410\.00 of \$300\.00/i)).toBeInTheDocument()
  })
})
