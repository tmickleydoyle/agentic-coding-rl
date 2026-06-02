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

describe('Category running-balance ledger', () => {
  it('starts on Ledger', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Ledger' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Categories')
    expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument()
    await nav(u, 'Report')
    expect(screen.getByRole('heading', { name: 'Report' })).toBeInTheDocument()
    await nav(u, 'Ledger')
    expect(screen.getByRole('heading', { name: 'Ledger' })).toBeInTheDocument()
  })

  it('records an in entry with running balance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Morning sales', '40', 'Sales', 'in')
    expect(screen.getByText('Morning sales: +$40 [Sales] balance $40')).toBeInTheDocument()
  })

  it('records an out entry as a negative', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bags', '10', 'Supplies', 'out')
    expect(screen.getByText('Bags: -$10 [Supplies] balance $-10')).toBeInTheDocument()
  })

  it('ignores an amount that is not greater than zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Nope', '0', 'Sales', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Balance: $0')).toBeInTheDocument()
  })

  it('computes a running balance across mixed entries in order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sale1', '100', 'Sales', 'in')
    await addEntry(u, 'Buy', '30', 'Supplies', 'out')
    await addEntry(u, 'Sale2', '20', 'Sales', 'in')
    expect(screen.getByText('Sale1: +$100 [Sales] balance $100')).toBeInTheDocument()
    expect(screen.getByText('Buy: -$30 [Supplies] balance $70')).toBeInTheDocument()
    expect(screen.getByText('Sale2: +$20 [Sales] balance $90')).toBeInTheDocument()
  })

  it('shows per-category in, out and net', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'S1', '100', 'Sales', 'in')
    await addEntry(u, 'S2', '40', 'Sales', 'in')
    await addEntry(u, 'Sup', '25', 'Supplies', 'out')
    await nav(u, 'Categories')
    expect(screen.getByText('Sales: in $140, out $0, net $140')).toBeInTheDocument()
    expect(screen.getByText('Supplies: in $0, out $25, net $-25')).toBeInTheDocument()
    expect(screen.getByText('Other: in $0, out $0, net $0')).toBeInTheDocument()
  })

  it('reports money in, out and balance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'In', '200', 'Sales', 'in')
    await addEntry(u, 'Out', '50', 'Supplies', 'out')
    await nav(u, 'Report')
    expect(screen.getByText('Money in: $200')).toBeInTheDocument()
    expect(screen.getByText('Money out: $50')).toBeInTheDocument()
    expect(screen.getByText('Balance: $150')).toBeInTheDocument()
  })

  it('names the biggest category by net', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '30', 'Sales', 'in')
    await addEntry(u, 'B', '80', 'Other', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: Other')).toBeInTheDocument()
  })

  it('breaks a biggest-category tie toward the first category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '50', 'Supplies', 'in')
    await addEntry(u, 'B', '50', 'Other', 'in')
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: Supplies')).toBeInTheDocument()
  })

  it('shows biggest category none with no entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: none')).toBeInTheDocument()
  })

  it('can show a negative biggest net when all categories are negative', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '10', 'Sales', 'out')
    await addEntry(u, 'B', '40', 'Other', 'out')
    await addEntry(u, 'C', '25', 'Supplies', 'out')
    await nav(u, 'Report')
    expect(screen.getByText('Biggest category: Sales')).toBeInTheDocument()
  })

  it('keeps entries when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Keep', '15', 'Sales', 'in')
    await nav(u, 'Report')
    await nav(u, 'Ledger')
    expect(screen.getByText('Keep: +$15 [Sales] balance $15')).toBeInTheDocument()
  })

  it('handles an out that drives the running balance negative', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Spend', '60', 'Supplies', 'out')
    await addEntry(u, 'Sale', '20', 'Sales', 'in')
    expect(screen.getByText('Spend: -$60 [Supplies] balance $-60')).toBeInTheDocument()
    expect(screen.getByText('Sale: +$20 [Sales] balance $-40')).toBeInTheDocument()
  })

  it('reports a negative balance when out exceeds in', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'In', '10', 'Sales', 'in')
    await addEntry(u, 'Out', '40', 'Supplies', 'out')
    await nav(u, 'Report')
    expect(screen.getByText('Balance: $-30')).toBeInTheDocument()
  })

  it('sums multiple entries within one category for net', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'I1', '90', 'Supplies', 'in')
    await addEntry(u, 'O1', '20', 'Supplies', 'out')
    await addEntry(u, 'O2', '15', 'Supplies', 'out')
    await nav(u, 'Categories')
    expect(screen.getByText('Supplies: in $90, out $35, net $55')).toBeInTheDocument()
  })

  it('appends entries in order at the bottom of the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'First', '5', 'Sales', 'in')
    await addEntry(u, 'Second', '5', 'Sales', 'in')
    await nav(u, 'Ledger')
    expect(screen.getByText('First: +$5 [Sales] balance $5')).toBeInTheDocument()
    expect(screen.getByText('Second: +$5 [Sales] balance $10')).toBeInTheDocument()
  })

  it('treats Other category entries correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Misc', '12', 'Other', 'in')
    await nav(u, 'Categories')
    expect(screen.getByText('Other: in $12, out $0, net $12')).toBeInTheDocument()
  })
})
