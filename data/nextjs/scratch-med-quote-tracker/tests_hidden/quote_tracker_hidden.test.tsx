// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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
  it('heading updates to Quotes (3) after three additions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'One', '10', 'sent')
    await addQuote(u, 'Two', '20', 'won')
    await addQuote(u, 'Three', '30', 'lost')
    expect(screen.getByRole('heading', { name: 'Quotes (3)' })).toBeInTheDocument()
  })

  it('filter by lost shows only lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'P1', '100', 'sent')
    await addQuote(u, 'P2', '200', 'won')
    await addQuote(u, 'P3', '300', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lost')
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
    expect(screen.getByText('P3')).toBeInTheDocument()
    expect(screen.queryByText('P1')).not.toBeInTheDocument()
    expect(screen.queryByText('P2')).not.toBeInTheDocument()
  })

  it('filter by sent shows only sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sent1', '50', 'sent')
    await addQuote(u, 'Won1', '60', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    expect(screen.getByText('Sent1')).toBeInTheDocument()
    expect(screen.queryByText('Won1')).not.toBeInTheDocument()
  })

  it('dashboard pending value sums multiple sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'S1', '150', 'sent')
    await addQuote(u, 'S2', '250', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $400.00')).toBeInTheDocument()
  })

  it('dashboard won value sums multiple won quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W1', '1000', 'won')
    await addQuote(u, 'W2', '500', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won value: $1500.00')).toBeInTheDocument()
  })

  it('dashboard win rate rounds down for 1 won 2 lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W', '100', 'won')
    await addQuote(u, 'L1', '100', 'lost')
    await addQuote(u, 'L2', '100', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 33%')).toBeInTheDocument()
  })

  it('dashboard total updates after delete (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ToGo', '100', 'sent')
    await addQuote(u, 'Stay', '200', 'won')
    await u.click(screen.getByRole('button', { name: /delete togo/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
  })

  it('deleting a won quote reduces won value on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'BigWin', '800', 'won')
    await addQuote(u, 'SmallWin', '200', 'won')
    await u.click(screen.getByRole('button', { name: /delete bigwin/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won value: $200.00')).toBeInTheDocument()
  })

  it('amount is formatted to two decimal places for a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'RoundCo', '42', 'sent')
    expect(screen.getByText('$42.00')).toBeInTheDocument()
  })

  it('theme button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'AA', '10', 'sent')
    await addQuote(u, 'BB', '20', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
    expect(screen.getByText('BB')).toBeInTheDocument()
    expect(screen.queryByText('AA')).not.toBeInTheDocument()
  })
})
