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

describe('Quote Tracker app', () => {
  it('starts on the Quotes view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeInTheDocument()
  })

  it('renders the nav bar with all three views', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Quotes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows zero showing total on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('adds a quote and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Acme Corp', '500', 'sent')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getAllByText('sent').length).toBeGreaterThan(0)
  })

  it('ignores a quote with a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('ignores a quote with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Client')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('formats amounts with two decimal places and comma separators', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Big Deal', '12500', 'won')
    expect(screen.getByText('$12,500.00')).toBeInTheDocument()
  })

  it('deletes a quote', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Temp Client', '300', 'sent')
    expect(screen.getByText('Temp Client')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete temp client/i }))
    expect(screen.queryByText('Temp Client')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('filters quotes by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Client A', '100', 'sent')
    await addQuote(u, 'Client B', '200', 'won')
    await addQuote(u, 'Client C', '150', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    expect(screen.getByText('Client B')).toBeInTheDocument()
    expect(screen.queryByText('Client A')).not.toBeInTheDocument()
    expect(screen.queryByText('Client C')).not.toBeInTheDocument()
  })

  it('showing total reflects the current filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '400', 'sent')
    await addQuote(u, 'Beta', '600', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    expect(screen.getByText('Showing total: $400.00')).toBeInTheDocument()
  })

  it('showing total with all filter sums everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'X', '100', 'sent')
    await addQuote(u, 'Y', '200', 'won')
    expect(screen.getByText('Showing total: $300.00')).toBeInTheDocument()
  })

  it('dashboard shows total quotes cross-view (shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Foo', '100', 'sent')
    await addQuote(u, 'Bar', '200', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
  })

  it('dashboard pending value sums only sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'P1', '500', 'sent')
    await addQuote(u, 'P2', '300', 'won')
    await addQuote(u, 'P3', '200', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $500.00')).toBeInTheDocument()
  })

  it('dashboard won value sums only won quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W1', '1000', 'won')
    await addQuote(u, 'W2', '2000', 'won')
    await addQuote(u, 'S1', '500', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won value: $3,000.00')).toBeInTheDocument()
  })

  it('dashboard win rate is 0% with no won or lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending', '100', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('dashboard win rate computes won/(won+lost) as whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W', '100', 'won')
    await addQuote(u, 'L', '100', 'lost')
    await addQuote(u, 'L2', '100', 'lost')
    await nav(u, 'Dashboard')
    // 1 won / 3 (won+lost) = 33%
    expect(screen.getByText('Win rate: 33%')).toBeInTheDocument()
  })

  it('dashboard ignores filter — uses all quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'C1', '200', 'won')
    await addQuote(u, 'C2', '300', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('reset all quotes clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ToDelete', '999', 'sent')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all quotes/i }))
    await nav(u, 'Quotes')
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('reset all quotes also resets dashboard totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Gone', '500', 'won')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all quotes/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('quote list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Persistent Co', '750', 'sent')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
  })
})
