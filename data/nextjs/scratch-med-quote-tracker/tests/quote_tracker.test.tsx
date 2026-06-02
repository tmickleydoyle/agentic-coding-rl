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
  it('starts on the Quotes view with zero quotes', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Quotes (0)' })).toBeInTheDocument()
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

  it('adds a quote and shows it with formatted amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Acme Corp', '1500', 'sent')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
  })

  it('ignores a quote with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByRole('heading', { name: 'Quotes (0)' })).toBeInTheDocument()
  })

  it('ignores a quote with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByRole('heading', { name: 'Quotes (0)' })).toBeInTheDocument()
  })

  it('deletes a quote', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Beta LLC', '200', 'sent')
    await u.click(screen.getByRole('button', { name: /delete beta llc/i }))
    expect(screen.queryByText('Beta LLC')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quotes (0)' })).toBeInTheDocument()
  })

  it('filters quotes by status and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ClientA', '100', 'sent')
    await addQuote(u, 'ClientB', '200', 'won')
    await addQuote(u, 'ClientC', '300', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'won')
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
    expect(screen.getByText('ClientB')).toBeInTheDocument()
    expect(screen.queryByText('ClientA')).not.toBeInTheDocument()
    expect(screen.queryByText('ClientC')).not.toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'X', '50', 'sent')
    await addQuote(u, 'Y', '60', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Quotes (2)' })).toBeInTheDocument()
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

  it('dashboard reflects added quotes (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending Co', '500', 'sent')
    await addQuote(u, 'Winner Inc', '1000', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $500.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $1000.00')).toBeInTheDocument()
  })

  it('dashboard pending value ignores won and lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'A', '300', 'won')
    await addQuote(u, 'B', '200', 'lost')
    await addQuote(u, 'C', '100', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $100.00')).toBeInTheDocument()
  })

  it('dashboard win rate is 50% for one won and one lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Won', '100', 'won')
    await addQuote(u, 'Lost', '100', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('dashboard win rate is 100% when all quotes are won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W1', '100', 'won')
    await addQuote(u, 'W2', '200', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('dashboard win rate ignores sent-only quotes (stays 0%)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending', '999', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('filter does not affect dashboard totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'S', '100', 'sent')
    await addQuote(u, 'W', '200', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Won value: $200.00')).toBeInTheDocument()
  })

  it('toggles theme and reflects in data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await nav(u, 'Quotes')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('quotes list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sticky Client', '750', 'sent')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByText('Sticky Client')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quotes (1)' })).toBeInTheDocument()
  })

  it('quote shows its status text in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'StatusCo', '400', 'lost')
    const li = screen.getByText('StatusCo').closest('li') as HTMLElement
    expect(within(li).getByText('lost')).toBeInTheDocument()
  })

  it('multiple quotes are all shown and individually deletable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '100', 'sent')
    await addQuote(u, 'Beta', '200', 'won')
    await addQuote(u, 'Gamma', '300', 'lost')
    expect(screen.getByRole('heading', { name: 'Quotes (3)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete beta/i }))
    expect(screen.getByRole('heading', { name: 'Quotes (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })
})
