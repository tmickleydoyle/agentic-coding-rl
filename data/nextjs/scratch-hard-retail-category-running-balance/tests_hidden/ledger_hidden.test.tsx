import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, memo: string, amount: string, category: string, type: string) {
  await nav(u, 'Ledger')
  await u.clear(screen.getByLabelText(/^memo$/i))
  await u.type(screen.getByLabelText(/^memo$/i), memo)
  await u.clear(screen.getByLabelText(/^amount$/i))
  if (amount) await u.type(screen.getByLabelText(/^amount$/i), amount)
  await u.selectOptions(screen.getByLabelText(/^category$/i), category)
  await u.selectOptions(screen.getByLabelText(/^type$/i), type)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Ledger hidden suite', () => {
  it('runs a realistic day end to end', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Open', '100', 'Other', 'in')
    await addEntry(u, 'Sale', '60', 'Sales', 'in')
    await addEntry(u, 'Restock', '45', 'Supplies', 'out')
    await addEntry(u, 'Sale2', '25', 'Sales', 'in')
    expect(screen.getByText('Restock: -$45 [Supplies] balance $115')).toBeInTheDocument()
    expect(screen.getByText('Sale2: +$25 [Sales] balance $140')).toBeInTheDocument()
    await nav(u, 'Categories')
    expect(screen.getByText('Sales: in $85, out $0, net $85')).toBeInTheDocument()
    expect(screen.getByText('Supplies: in $0, out $45, net $-45')).toBeInTheDocument()
    expect(screen.getByText('Other: in $100, out $0, net $100')).toBeInTheDocument()
    await nav(u, 'Report')
    expect(screen.getByText('Money in: $185')).toBeInTheDocument()
    expect(screen.getByText('Money out: $45')).toBeInTheDocument()
    expect(screen.getByText('Balance: $140')).toBeInTheDocument()
    expect(screen.getByText('Biggest category: Other')).toBeInTheDocument()
  })

  it('ignores a negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bad', '-5', 'Sales', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Balance: $0')).toBeInTheDocument()
    expect(screen.getByText('Biggest category: none')).toBeInTheDocument()
  })

  it('lets a category net flip the biggest as entries accumulate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '30', 'Sales', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: Sales')).toBeInTheDocument()
    await addEntry(u, 'B', '70', 'Supplies', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: Supplies')).toBeInTheDocument()
  })
})
