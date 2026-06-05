import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

async function addPerson(u: U, name: string) {
  await u.clear(screen.getByLabelText(/person name/i))
  await u.type(screen.getByLabelText(/person name/i), name)
  await u.click(screen.getByRole('button', { name: /add person/i }))
}

async function addExpense(u: U, desc: string, amount: string, payer: string) {
  await u.clear(screen.getByLabelText(/description/i))
  await u.type(screen.getByLabelText(/description/i), desc)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), amount)
  await u.selectOptions(screen.getByLabelText(/paid by/i), payer)
  await u.click(screen.getByRole('button', { name: /add expense/i }))
}

function balances() {
  return screen.getByRole('region', { name: 'Balances' })
}
function settlement() {
  return screen.getByRole('region', { name: 'Settlement' })
}

describe('Expense splitter', () => {
  it('adds people and lists them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    const people = screen.getByRole('region', { name: 'People' })
    expect(within(people).getByText('Alice')).toBeInTheDocument()
    expect(within(people).getByText('Bob')).toBeInTheDocument()
  })

  it('does not add a duplicate person', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Alice')
    const people = screen.getByRole('region', { name: 'People' })
    expect(within(people).getAllByText('Alice')).toHaveLength(1)
  })

  it('shows zero balances before any expense', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    expect(within(balances()).getByText(/alice \+\$0\.00/i)).toBeInTheDocument()
    expect(within(balances()).getByText(/bob \+\$0\.00/i)).toBeInTheDocument()
  })

  it('splits a single expense equally and signs balances', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    await addExpense(u, 'Dinner', '10', 'Alice')
    expect(within(balances()).getByText(/alice \+\$5\.00/i)).toBeInTheDocument()
    expect(within(balances()).getByText(/bob -\$5\.00/i)).toBeInTheDocument()
  })

  it('computes a settlement transfer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    await addExpense(u, 'Dinner', '10', 'Alice')
    expect(within(settlement()).getByText(/bob pays alice \$5\.00/i)).toBeInTheDocument()
  })

  it('nets out offsetting expenses to settled up', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    await addExpense(u, 'Dinner', '10', 'Alice')
    await addExpense(u, 'Taxi', '10', 'Bob')
    expect(within(balances()).getByText(/alice \+\$0\.00/i)).toBeInTheDocument()
    expect(within(balances()).getByText(/bob \+\$0\.00/i)).toBeInTheDocument()
    expect(within(settlement()).getByText(/all settled up/i)).toBeInTheDocument()
  })

  it('splits across three people', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    await addPerson(u, 'Carol')
    await addExpense(u, 'Hotel', '30', 'Alice')
    expect(within(balances()).getByText(/alice \+\$20\.00/i)).toBeInTheDocument()
    expect(within(balances()).getByText(/bob -\$10\.00/i)).toBeInTheDocument()
    expect(within(balances()).getByText(/carol -\$10\.00/i)).toBeInTheDocument()
    expect(within(settlement()).getByText(/bob pays alice \$10\.00/i)).toBeInTheDocument()
    expect(within(settlement()).getByText(/carol pays alice \$10\.00/i)).toBeInTheDocument()
  })

  it('ignores an expense with no amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPerson(u, 'Alice')
    await addPerson(u, 'Bob')
    await u.clear(screen.getByLabelText(/description/i))
    await u.type(screen.getByLabelText(/description/i), 'Bad')
    await u.click(screen.getByRole('button', { name: /add expense/i }))
    expect(within(balances()).getByText(/alice \+\$0\.00/i)).toBeInTheDocument()
    expect(within(settlement()).getByText(/all settled up/i)).toBeInTheDocument()
  })
})
