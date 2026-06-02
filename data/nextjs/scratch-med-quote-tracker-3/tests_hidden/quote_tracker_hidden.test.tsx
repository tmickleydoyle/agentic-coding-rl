// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('dashboard starts empty with all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('win rate is 100% when all quotes are won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '100', 'won')
    await addQuote(u, 'Beta', '200', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('filter by lost shows only lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Loser Co', '50', 'lost')
    await addQuote(u, 'Winner Co', '100', 'won')
    await userEvent.setup().selectOptions(screen.getByLabelText('Filter by status'), 'lost')
    expect(screen.getByText('Loser Co')).toBeInTheDocument()
    expect(screen.queryByText('Winner Co')).not.toBeInTheDocument()
  })

  it('showing total for lost filter sums lost amounts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'L1', '300', 'lost')
    await addQuote(u, 'L2', '700', 'lost')
    await addQuote(u, 'S1', '999', 'sent')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lost')
    expect(screen.getByText('Showing total: $1,000.00')).toBeInTheDocument()
  })

  it('delete reduces the showing total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Keep', '800', 'sent')
    await addQuote(u, 'Remove', '200', 'sent')
    await u.click(screen.getByRole('button', { name: /delete remove/i }))
    expect(screen.getByText('Showing total: $800.00')).toBeInTheDocument()
  })

  it('dashboard pending value updates after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'KeepSent', '600', 'sent')
    await addQuote(u, 'DelSent', '400', 'sent')
    await u.click(screen.getByRole('button', { name: /delete delsent/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $600.00')).toBeInTheDocument()
    expect(screen.getByText('Total quotes: 1')).toBeInTheDocument()
  })

  it('adding multiple quotes with same client name all appear', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Dupe Client', '100', 'sent')
    await addQuote(u, 'Dupe Client', '200', 'won')
    const items = screen.getAllByText('Dupe Client')
    expect(items.length).toBe(2)
  })

  it('filter switch back to all shows all quotes again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sent One', '100', 'sent')
    await addQuote(u, 'Won One', '200', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    expect(screen.queryByText('Won One')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Won One')).toBeInTheDocument()
    expect(screen.getByText('Sent One')).toBeInTheDocument()
  })

  it('theme toggles twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('reset clears and dashboard shows all zeros afterward', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'A', '100', 'won')
    await addQuote(u, 'B', '200', 'lost')
    await addQuote(u, 'C', '300', 'sent')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all quotes/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('dashboard won value excludes sent and lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'WonA', '1000', 'won')
    await addQuote(u, 'SentB', '5000', 'sent')
    await addQuote(u, 'LostC', '3000', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won value: $1,000.00')).toBeInTheDocument()
  })
})
