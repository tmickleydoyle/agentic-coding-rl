import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addQuote(u: U, client: string, amount: string, status: string = 'sent') {
  await u.clear(screen.getByLabelText('Client'))
  await u.type(screen.getByLabelText('Client'), client)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.selectOptions(screen.getByLabelText('New quote status'), status)
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

  it('navigates to Dashboard and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    await nav(u, 'Quotes')
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows zero totals on empty Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('shows Showing total: $0.00 with no quotes', () => {
    render(<App />)
    expect(screen.getByText('Showing total: $0.00')).toBeInTheDocument()
  })

  it('adds a quote and displays it with formatted amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Acme Corp', '1500', 'sent')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
  })

  it('ignores a quote with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores a quote with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Test')
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('deletes a quote', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ToDelete', '200', 'sent')
    expect(screen.getByText('ToDelete')).toBeInTheDocument()
    await u.click(within(quoteRow('ToDelete')).getByRole('button', { name: /delete toDelete/i }))
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument()
  })

  it('updates status in-place via the row select', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'GlobalTech', '999', 'sent')
    await u.selectOptions(within(quoteRow('GlobalTech')).getByRole('combobox', { name: /status for globaltech/i }), 'won')
    expect(within(quoteRow('GlobalTech')).getByRole('combobox', { name: /status for globaltech/i })).toHaveValue('won')
  })

  it('filters quotes by status and updates Showing total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Alpha', '100', 'sent')
    await addQuote(u, 'Beta', '200', 'won')
    await addQuote(u, 'Gamma', '300', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter'), 'sent')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $100.00')).toBeInTheDocument()
  })

  it('filter All shows every quote and correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'A', '50', 'sent')
    await addQuote(u, 'B', '75', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter'), 'lost')
    await u.selectOptions(screen.getByLabelText('Filter'), 'all')
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('Showing total: $125.00')).toBeInTheDocument()
  })

  it('Dashboard total quotes reflects added quotes (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'X', '500', 'sent')
    await addQuote(u, 'Y', '300', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
  })

  it('Dashboard pending value includes sent and won only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Sent Co', '400', 'sent')
    await addQuote(u, 'Won Co', '600', 'won')
    await addQuote(u, 'Lost Co', '9999', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $1000.00')).toBeInTheDocument()
  })

  it('Dashboard win rate is won / (won + lost) as whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W1', '100', 'won')
    await addQuote(u, 'W2', '100', 'won')
    await addQuote(u, 'L1', '100', 'lost')
    await nav(u, 'Dashboard')
    // 2/(2+1) = 66.67% -> 67%
    expect(screen.getByText('Win rate: 67%')).toBeInTheDocument()
  })

  it('Dashboard shows 0% win rate when no won or lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Pending', '500', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('Dashboard win rate is 100% when all closed quotes are won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Winner', '1000', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('status change in Quotes view updates Dashboard stats (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Flip Corp', '800', 'sent')
    await u.selectOptions(within(quoteRow('Flip Corp')).getByRole('combobox', { name: /status for flip corp/i }), 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Sent: 0')).toBeInTheDocument()
  })

  it('deleting a quote updates Dashboard total quotes (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Temp', '100', 'sent')
    await u.click(within(quoteRow('Temp')).getByRole('button', { name: /delete temp/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 0')).toBeInTheDocument()
  })

  it('filter does NOT affect Dashboard stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Visible', '300', 'won')
    await addQuote(u, 'Hidden', '700', 'lost')
    await u.selectOptions(screen.getByLabelText('Filter'), 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Quotes')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('quotes list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Persistent', '250', 'sent')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })
})
