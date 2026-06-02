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

  it('shows empty filtered total on load', () => {
    render(<App />)
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
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

  it('navigates back to Quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeInTheDocument()
  })

  it('adds a quote and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Acme Corp', '1500', 'sent')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
    expect(screen.getAllByText('sent').length).toBeGreaterThan(0)
  })

  it('ignores a quote with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '500')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
  })

  it('ignores a quote with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Nobody')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
  })

  it('deletes a quote', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'TempClient', '999', 'sent')
    expect(screen.getByText('TempClient')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete tempclient/i }))
    expect(screen.queryByText('TempClient')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
  })

  it('filtered total updates when a quote is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '200', 'sent')
    await addQuote(u, 'Beta', '300', 'won')
    expect(screen.getByText('Filtered total: $500.00')).toBeInTheDocument()
  })

  it('filter by status shows only matching quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sent Co', '100', 'sent')
    await addQuote(u, 'Won Co', '200', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    expect(screen.getByText('Won Co')).toBeInTheDocument()
    expect(screen.queryByText('Sent Co')).not.toBeInTheDocument()
    expect(screen.getByText('Filtered total: $200.00')).toBeInTheDocument()
  })

  it('filter all restores all quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sent Co', '100', 'sent')
    await addQuote(u, 'Won Co', '200', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Sent Co')).toBeInTheDocument()
    expect(screen.getByText('Won Co')).toBeInTheDocument()
    expect(screen.getByText('Filtered total: $300.00')).toBeInTheDocument()
  })

  it('dashboard shows zero stats with no quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('dashboard reflects added quotes (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ClientA', '1000', 'sent')
    await addQuote(u, 'ClientB', '500', 'won')
    await addQuote(u, 'ClientC', '250', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $1000.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $500.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('dashboard pending value ignores won and lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W', '800', 'won')
    await addQuote(u, 'L', '400', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
  })

  it('win rate is 100% when all closed quotes are won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Winner1', '300', 'won')
    await addQuote(u, 'Winner2', '700', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('dashboard ignores filter — uses all quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'S1', '600', 'sent')
    await addQuote(u, 'W1', '400', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Won value: $400.00')).toBeInTheDocument()
  })

  it('theme starts as light and data-theme attribute is set', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Quotes')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('quotes list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Persistent Co', '750', 'sent')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
    expect(screen.getByText('$750.00')).toBeInTheDocument()
  })

  it('filtered total is 0 when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'OnlySent', '300', 'sent')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    expect(screen.getByText('Filtered total: $0.00')).toBeInTheDocument()
  })
})
