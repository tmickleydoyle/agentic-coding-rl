import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addQuote(u: U, client: string, amount: string) {
  await u.clear(screen.getByLabelText('Client'))
  await u.type(screen.getByLabelText('Client'), client)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.click(screen.getByRole('button', { name: /add quote/i }))
}

function quoteRow(client: string): HTMLElement {
  const el = screen.getByText(client).closest('li')
  if (!el) throw new Error(`no row for ${client}`)
  return el as HTMLElement
}

describe('Quote Tracker app', () => {
  it('starts on the Quotes view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeInTheDocument()
  })

  it('shows Showing: 0 with no quotes', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('navigates to Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a quote and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Acme Corp', '1500')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('new quote has status sent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'BizCo', '200')
    expect(within(quoteRow('BizCo')).getByText('sent')).toBeInTheDocument()
  })

  it('ignores a quote with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('ignores a quote with blank amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Nobody')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('ignores a quote with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Zero Inc', '0')
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('marks a quote as won and disables Mark won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'WinCo', '900')
    await u.click(within(quoteRow('WinCo')).getByRole('button', { name: /mark winco won/i }))
    expect(within(quoteRow('WinCo')).getByText('won')).toBeInTheDocument()
    expect(within(quoteRow('WinCo')).getByRole('button', { name: /mark winco won/i })).toBeDisabled()
  })

  it('marks a quote as lost and disables Mark lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'LoseCo', '300')
    await u.click(within(quoteRow('LoseCo')).getByRole('button', { name: /mark loseco lost/i }))
    expect(within(quoteRow('LoseCo')).getByText('lost')).toBeInTheDocument()
    expect(within(quoteRow('LoseCo')).getByRole('button', { name: /mark loseco lost/i })).toBeDisabled()
  })

  it('filter by Sent shows only sent quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '100')
    await addQuote(u, 'Beta', '200')
    await u.click(within(quoteRow('Alpha')).getByRole('button', { name: /mark alpha won/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Sent')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('filter by Won shows only won quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Gamma', '500')
    await addQuote(u, 'Delta', '600')
    await u.click(within(quoteRow('Gamma')).getByRole('button', { name: /mark gamma won/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Won')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('filter by Lost shows only lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Epsilon', '400')
    await addQuote(u, 'Zeta', '800')
    await u.click(within(quoteRow('Zeta')).getByRole('button', { name: /mark zeta lost/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Lost')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Zeta')).toBeInTheDocument()
    expect(screen.queryByText('Epsilon')).not.toBeInTheDocument()
  })

  it('dashboard shows Total quotes: 0 and zero values initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('dashboard pending value sums sent quotes (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Client A', '1000')
    await addQuote(u, 'Client B', '500')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $1500.00')).toBeInTheDocument()
  })

  it('dashboard win rate is 50% when one won one lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'WinnerX', '1000')
    await addQuote(u, 'LoserX', '500')
    await u.click(within(quoteRow('WinnerX')).getByRole('button', { name: /mark winnerx won/i }))
    await u.click(within(quoteRow('LoserX')).getByRole('button', { name: /mark loserx lost/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('dashboard win rate is 100% when all quotes won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Solo', '750')
    await u.click(within(quoteRow('Solo')).getByRole('button', { name: /mark solo won/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Won value: $750.00')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
  })

  it('marking won removes amount from pending on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending One', '300')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $300.00')).toBeInTheDocument()
    await nav(u, 'Quotes')
    await u.click(within(quoteRow('Pending One')).getByRole('button', { name: /mark pending one won/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $300.00')).toBeInTheDocument()
  })

  it('theme toggles to dark via Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Quotes')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('quotes list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Persisted Client', '999')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByText('Persisted Client')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })
})
