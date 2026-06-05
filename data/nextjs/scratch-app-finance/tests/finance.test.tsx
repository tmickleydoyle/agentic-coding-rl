import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTxn(u: U, desc: string, amount: string, category: string, type: string) {
  await u.clear(screen.getByLabelText(/description/i))
  await u.type(screen.getByLabelText(/description/i), desc)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), amount)
  await u.selectOptions(screen.getByLabelText(/category/i), category)
  await u.selectOptions(screen.getByLabelText(/^type$/i), type)
  await u.click(screen.getByRole('button', { name: /add transaction/i }))
}
function budgets() {
  return screen.getByRole('region', { name: 'Budgets view' })
}

describe('Budgeting app', () => {
  it('starts on Transactions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Budgets')
    expect(screen.getByRole('heading', { name: 'Budgets' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Transactions')
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeInTheDocument()
  })

  it('adds an expense rendered with a minus sign', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Groceries', '120', 'Food', 'expense')
    expect(screen.getByText('Groceries: -$120 (Food)')).toBeInTheDocument()
  })

  it('adds income rendered with a plus sign', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Paycheck', '1000', 'Salary', 'income')
    expect(screen.getByText('Paycheck: +$1000 (Salary)')).toBeInTheDocument()
  })

  it('ignores a non-positive amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Bad', '0', 'Food', 'expense')
    await nav(u, 'Reports')
    expect(screen.getByText(/total expense: \$0/i)).toBeInTheDocument()
  })

  it('accumulates category spend on Budgets (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Lunch', '120', 'Food', 'expense')
    await addTxn(u, 'Dinner', '100', 'Food', 'expense')
    await nav(u, 'Budgets')
    expect(within(budgets()).getByText(/food: \$220 of \$300/i)).toBeInTheDocument()
    expect(within(budgets()).queryByText(/food over budget/i)).not.toBeInTheDocument()
  })

  it('flags a category over budget', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Splurge', '350', 'Food', 'expense')
    await nav(u, 'Budgets')
    expect(within(budgets()).getByText(/food: \$350 of \$300/i)).toBeInTheDocument()
    expect(within(budgets()).getByText(/food over budget/i)).toBeInTheDocument()
  })

  it('computes reports: balance and savings rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Pay', '1000', 'Salary', 'income')
    await addTxn(u, 'Rent', '400', 'Fun', 'expense')
    await nav(u, 'Reports')
    expect(screen.getByText(/total income: \$1000/i)).toBeInTheDocument()
    expect(screen.getByText(/total expense: \$400/i)).toBeInTheDocument()
    expect(screen.getByText(/balance: \$600/i)).toBeInTheDocument()
    expect(screen.getByText(/savings rate: 60%/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reports')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides income rows when Show expenses only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTxn(u, 'Paycheck', '1000', 'Salary', 'income')
    await addTxn(u, 'Coffee', '5', 'Food', 'expense')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show expenses only/i))
    await nav(u, 'Transactions')
    expect(screen.queryByText('Paycheck: +$1000 (Salary)')).not.toBeInTheDocument()
    expect(screen.getByText('Coffee: -$5 (Food)')).toBeInTheDocument()
  })
})
