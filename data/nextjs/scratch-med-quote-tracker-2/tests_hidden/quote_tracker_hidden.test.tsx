// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view sequences.
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

describe('Quote Tracker (held-out)', () => {
  it('adds multiple quotes and Showing total covers all of them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Corp A', '100', 'sent')
    await addQuote(u, 'Corp B', '200', 'won')
    await addQuote(u, 'Corp C', '300', 'lost')
    expect(screen.getByText('Showing total: $600.00')).toBeInTheDocument()
  })

  it('filter by won shows only won quotes and matching total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'WonCo', '450', 'won')
    await addQuote(u, 'SentCo', '550', 'sent')
    await u.selectOptions(screen.getByLabelText('Filter'), 'won')
    expect(screen.getByText('WonCo')).toBeInTheDocument()
    expect(screen.queryByText('SentCo')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $450.00')).toBeInTheDocument()
  })

  it('filter by lost shows only lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'LostCo', '300', 'lost')
    await addQuote(u, 'WonCo', '700', 'won')
    await u.selectOptions(screen.getByLabelText('Filter'), 'lost')
    expect(screen.getByText('LostCo')).toBeInTheDocument()
    expect(screen.queryByText('WonCo')).not.toBeInTheDocument()
    expect(screen.getByText('Showing total: $300.00')).toBeInTheDocument()
  })

  it('dashboard counts Won, Lost, Sent correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W', '100', 'won')
    await addQuote(u, 'L', '100', 'lost')
    await addQuote(u, 'S', '100', 'sent')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Lost: 1')).toBeInTheDocument()
    expect(screen.getByText('Sent: 1')).toBeInTheDocument()
  })

  it('pending value excludes lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'BigLoss', '99999', 'lost')
    await addQuote(u, 'SmallWin', '250', 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $250.00')).toBeInTheDocument()
  })

  it('win rate rounds correctly for 1 won 3 lost (25%)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'W1', '100', 'won')
    await addQuote(u, 'L1', '100', 'lost')
    await addQuote(u, 'L2', '100', 'lost')
    await addQuote(u, 'L3', '100', 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 25%')).toBeInTheDocument()
  })

  it('changing a lost quote to won updates dashboard win rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Flipper', '500', 'lost')
    await u.selectOptions(within(quoteRow('Flipper')).getByRole('combobox', { name: /status for flipper/i }), 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('changing a sent quote to won adjusts pending value on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Mover', '1000', 'sent')
    // still pending as sent -> won, stays in pending
    await u.selectOptions(within(quoteRow('Mover')).getByRole('combobox', { name: /status for mover/i }), 'won')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $1000.00')).toBeInTheDocument()
  })

  it('changing a won quote to lost removes it from pending value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Dropper', '800', 'won')
    await u.selectOptions(within(quoteRow('Dropper')).getByRole('combobox', { name: /status for dropper/i }), 'lost')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $0.00')).toBeInTheDocument()
  })

  it('deleting a won quote lowers win rate to 0% when only one existed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'OnlyWin', '300', 'won')
    await addQuote(u, 'OnlyLost', '300', 'lost')
    await u.click(within(quoteRow('OnlyWin')).getByRole('button', { name: /delete onlywin/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('filter state resets do not affect data when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Stay', '100', 'sent')
    await u.selectOptions(screen.getByLabelText('Filter'), 'won')
    await nav(u, 'Dashboard')
    await nav(u, 'Quotes')
    // quote still present regardless of filter reset
    await u.selectOptions(screen.getByLabelText('Filter'), 'all')
    expect(screen.getByText('Stay')).toBeInTheDocument()
  })

  it('add quote with a won status shows it immediately in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'DirectWin', '1200', 'won')
    expect(screen.getByText('DirectWin')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
