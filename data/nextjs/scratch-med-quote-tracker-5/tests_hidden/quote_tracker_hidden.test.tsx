// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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

describe('Quote Tracker (held-out)', () => {
  it('shows All filter counts all quotes including won and lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Corp1', '100')
    await addQuote(u, 'Corp2', '200')
    await addQuote(u, 'Corp3', '300')
    await u.click(within(quoteRow('Corp1')).getByRole('button', { name: /mark corp1 won/i }))
    await u.click(within(quoteRow('Corp2')).getByRole('button', { name: /mark corp2 lost/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('filter resets to All shows all again after filtering', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Eta', '111')
    await addQuote(u, 'Theta', '222')
    await u.click(within(quoteRow('Eta')).getByRole('button', { name: /mark eta won/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Won')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('dashboard win rate rounds to 33% for one won two lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'P1', '100')
    await addQuote(u, 'P2', '100')
    await addQuote(u, 'P3', '100')
    await u.click(within(quoteRow('P1')).getByRole('button', { name: /mark p1 won/i }))
    await u.click(within(quoteRow('P2')).getByRole('button', { name: /mark p2 lost/i }))
    await u.click(within(quoteRow('P3')).getByRole('button', { name: /mark p3 lost/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win rate: 33%')).toBeInTheDocument()
  })

  it('pending value excludes lost quotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'LoserA', '400')
    await addQuote(u, 'SentB', '600')
    await u.click(within(quoteRow('LoserA')).getByRole('button', { name: /mark losera lost/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pending value: $600.00')).toBeInTheDocument()
  })

  it('dashboard total quotes counts all statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'Q1', '50')
    await addQuote(u, 'Q2', '50')
    await addQuote(u, 'Q3', '50')
    await u.click(within(quoteRow('Q1')).getByRole('button', { name: /mark q1 won/i }))
    await u.click(within(quoteRow('Q2')).getByRole('button', { name: /mark q2 lost/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 3')).toBeInTheDocument()
  })

  it('amount is displayed with two decimal places for whole numbers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'DecimalTest', '250')
    expect(screen.getByText('$250.00')).toBeInTheDocument()
  })

  it('mark won disables mark won button but not mark lost', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'ToggleCheck', '500')
    await u.click(within(quoteRow('ToggleCheck')).getByRole('button', { name: /mark togglecheck won/i }))
    expect(within(quoteRow('ToggleCheck')).getByRole('button', { name: /mark togglecheck won/i })).toBeDisabled()
    expect(within(quoteRow('ToggleCheck')).getByRole('button', { name: /mark togglecheck lost/i })).not.toBeDisabled()
  })

  it('multiple quotes accumulate correctly in won value on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'WA', '1000')
    await addQuote(u, 'WB', '2000')
    await u.click(within(quoteRow('WA')).getByRole('button', { name: /mark wa won/i }))
    await u.click(within(quoteRow('WB')).getByRole('button', { name: /mark wb won/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won value: $3000.00')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('filter does not affect dashboard stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addQuote(u, 'FilterA', '100')
    await addQuote(u, 'FilterB', '200')
    await u.click(within(quoteRow('FilterA')).getByRole('button', { name: /mark filtera won/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Won')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total quotes: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending value: $200.00')).toBeInTheDocument()
  })
})
