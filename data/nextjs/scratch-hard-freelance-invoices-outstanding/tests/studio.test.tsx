import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function logInvoice(u: U, label: string, amount: string, days: string, client: string) {
  await u.clear(screen.getByLabelText(/invoice label/i))
  await u.type(screen.getByLabelText(/invoice label/i), label)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), amount)
  await u.clear(screen.getByLabelText(/days old/i))
  await u.type(screen.getByLabelText(/days old/i), days)
  await u.selectOptions(screen.getByLabelText(/^client$/i), client)
  await u.click(screen.getByRole('button', { name: /log invoice/i }))
}
const clientsView = () => screen.getByRole('region', { name: 'Clients view' })
const reportsView = () => screen.getByRole('region', { name: 'Reports view' })

describe('Freelance invoicing tracker', () => {
  it('starts on Invoices', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Clients')
    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Invoices')
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('seeds three clients in the selector', () => {
    render(<App />)
    const sel = screen.getByLabelText(/^client$/i)
    expect(within(sel).getByRole('option', { name: 'Acme Co' })).toBeInTheDocument()
    expect(within(sel).getByRole('option', { name: 'Beanstalk' })).toBeInTheDocument()
    expect(within(sel).getByRole('option', { name: 'Cogwheel' })).toBeInTheDocument()
  })

  it('logs an invoice as UNPAID', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Logo design', '500', '10', 'Acme Co')
    expect(screen.getByText('Logo design — $500 — Acme Co — UNPAID')).toBeInTheDocument()
  })

  it('ignores an invoice with a non-positive amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Freebie', '0', '5', 'Acme Co')
    expect(screen.queryByText(/freebie/i)).not.toBeInTheDocument()
  })

  it('ignores an invoice with a blank label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/amount/i), '200')
    await u.type(screen.getByLabelText(/days old/i), '5')
    await u.click(screen.getByRole('button', { name: /log invoice/i }))
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total outstanding: $0')).toBeInTheDocument()
  })

  it('marks an invoice paid and removes its button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Audit', '300', '5', 'Beanstalk')
    await u.click(screen.getByRole('button', { name: 'Mark Audit paid' }))
    expect(screen.getByText('Audit — $300 — Beanstalk — PAID')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark Audit paid' })).not.toBeInTheDocument()
  })

  it('shows outstanding total and count per client (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Phase 1', '400', '5', 'Acme Co')
    await logInvoice(u, 'Phase 2', '600', '5', 'Acme Co')
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Acme Co: $1000 outstanding across 2 unpaid'),
    ).toBeInTheDocument()
  })

  it('excludes paid invoices from a client outstanding balance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Sprint A', '400', '5', 'Cogwheel')
    await logInvoice(u, 'Sprint B', '600', '5', 'Cogwheel')
    await u.click(screen.getByRole('button', { name: 'Mark Sprint A paid' }))
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Cogwheel: $600 outstanding across 1 unpaid'),
    ).toBeInTheDocument()
  })

  it('shows zero outstanding for a client with no invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Beanstalk: $0 outstanding across 0 unpaid'),
    ).toBeInTheDocument()
  })

  it('adds a client that then appears in the invoice selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Clients')
    await u.type(screen.getByLabelText(/client name/i), 'Dynamo')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(
      within(clientsView()).getByText('Dynamo: $0 outstanding across 0 unpaid'),
    ).toBeInTheDocument()
    await nav(u, 'Invoices')
    const sel = screen.getByLabelText(/^client$/i)
    expect(within(sel).getByRole('option', { name: 'Dynamo' })).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Clients')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(within(clientsView()).getAllByRole('listitem')).toHaveLength(3)
  })

  it('buckets a fresh invoice as Current', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'New', '100', '10', 'Acme Co')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Current (0-30): $100')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Overdue (31-60): $0')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Critical (61+): $0')).toBeInTheDocument()
  })

  it('buckets a 45-day invoice as Overdue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Mid', '250', '45', 'Acme Co')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Overdue (31-60): $250')).toBeInTheDocument()
  })

  it('buckets a 90-day invoice as Critical', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Old', '700', '90', 'Acme Co')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Critical (61+): $700')).toBeInTheDocument()
  })

  it('treats exactly 30 days as Current', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Edge30', '90', '30', 'Acme Co')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Current (0-30): $90')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Overdue (31-60): $0')).toBeInTheDocument()
  })

  it('treats exactly 60 days as Overdue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Edge60', '80', '60', 'Acme Co')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Overdue (31-60): $80')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Critical (61+): $0')).toBeInTheDocument()
  })

  it('sums Total outstanding across buckets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'A', '100', '10', 'Acme Co')
    await logInvoice(u, 'B', '200', '45', 'Beanstalk')
    await logInvoice(u, 'C', '300', '90', 'Cogwheel')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total outstanding: $600')).toBeInTheDocument()
  })

  it('drops a paid invoice out of the aging report', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Paidoff', '500', '90', 'Acme Co')
    await u.click(screen.getByRole('button', { name: 'Mark Paidoff paid' }))
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Critical (61+): $0')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Total outstanding: $0')).toBeInTheDocument()
  })

  it('clears the invoice form after logging', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Clearme', '120', '5', 'Acme Co')
    expect(screen.getByLabelText(/invoice label/i)).toHaveValue('')
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null)
  })
})
