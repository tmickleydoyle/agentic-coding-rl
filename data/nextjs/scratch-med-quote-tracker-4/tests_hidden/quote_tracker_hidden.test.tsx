// HELD-OUT generalization tests — fresh scenarios not in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addQuote(u: U, client: string, amount: string, status: string) {
  await u.clear(screen.getByLabelText('Client'))
  await u.type(screen.getByLabelText('Client'), client)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add quote/i }))
}

describe('Quote Tracker (held-out)', () => {
  it('adds multiple quotes and filtered total sums them all when filter is all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Corp A', '400', 'sent')
    await addQuote(u, 'Corp B', '600', 'won')
    await addQuote(u, 'Corp C', '200', 'lost')
    expect(screen.getByText('Filtered total: $1200.00')).toBeInTheDocument()
  })

  it('filter by lost shows only lost quotes and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Loser Inc', '350', 'lost')
    await addQuote(u, 'Winner Ltd', '650', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lost')
    expect(screen.getByText('Loser Inc')).toBeInTheDocument()
    expect(screen.queryByText('Winner Ltd')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered total: $350.00')).toBeInTheDocument()
  })

  it('deleting a quote updates the filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'RemoveMe', '500', 'sent')
    await addQuote(u, 'KeepMe', '300', 'sent')
    await u.click(screen.getByRole('button', { name: /delete removeme/i }))
    expect(screen.getByText('Filtered total: $300.00')).toBeInTheDocument()
  })

  it('dashboard total quotes counts sent, won, and lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'S', '100', 'sent')
    await addQuote(u, 'W', '200', 'won')
    await addQuote(u, 'L', '300', 'lost')
    await addQuote(u, 'W2', '400', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 4')).toBeInTheDocument()
  })

  it('win rate rounds correctly for one won one lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W', '100', 'won')
    await addQuote(u, 'L', '100', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('win rate is 0% when all closed quotes are lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'L1', '200', 'lost')
    await addQuote(u, 'L2', '300', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('pending value sums only sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending1', '450', 'sent')
    await addQuote(u, 'Pending2', '550', 'sent')
    await addQuote(u, 'WonOne', '999', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $1000.00')).toBeInTheDocument()
  })

  it('dashboard updates after deleting a quote (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ToDelete', '800', 'won')
    await addQuote(u, 'Keeper', '200', 'won')
    await u.click(screen.getByRole('button', { name: /delete todelete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 1')).toBeInTheDocument()
    expect(screen.getByText('Won value: $200.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('filter state does not affect dashboard total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'SentA', '100', 'sent')
    await addQuote(u, 'WonB', '200', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
  })

  it('amount with decimals is formatted correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'DecimalCo', '1234.5', 'sent')
    expect(screen.getByText('$1234.50')).toBeInTheDocument()
  })

  it('filter by sent shows filtered total only for sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'S1', '150', 'sent')
    await addQuote(u, 'S2', '250', 'sent')
    await addQuote(u, 'W1', '500', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    expect(screen.getByText('Filtered total: $400.00')).toBeInTheDocument()
  })
})
