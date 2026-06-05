// HELD-OUT generalization tests — different inputs, edge cases, sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function invoiceRow(client: string): HTMLElement {
  const el = screen.getByText(client).closest('li')
  if (!el) throw new Error(`no row for ${client}`)
  return el as HTMLElement
}

async function addInvoice(u: U, client: string, amount: string) {
  await u.clear(screen.getByLabelText('Client'))
  await u.type(screen.getByLabelText('Client'), client)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.click(screen.getByRole('button', { name: /add invoice/i }))
}

describe('Invoice Tracker (held-out)', () => {
  it('all three seeded invoices appear in the list', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('outstanding total excludes already-paid Globex on load', () => {
    render(<App />)
    // Acme $500 + Initech $750 = $1250
    expect(screen.getByText('Outstanding: $1250.00')).toBeInTheDocument()
  })

  it('marking all unpaid invoices paid brings outstanding to $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark paid initech/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('Summary paid rate is 0% when no invoices exist — seeded data present so check 33% initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 33%')).toBeInTheDocument()
  })

  it('Summary paid rate becomes 100% after all invoices are marked paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark paid initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('Unpaid Only filter shows exactly 2 items initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: 'Unpaid Only' }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })

  it('Unpaid Only filter shows 1 item after marking one invoice paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(screen.getByRole('radio', { name: 'Unpaid Only' }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('adding a new invoice increments the list count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Soylent Corp', '180.50')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(4)
  })

  it('new invoice amount is formatted correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'FutureCo', '42')
    expect(screen.getByText('$42.00')).toBeInTheDocument()
  })

  it('new invoice appears as Unpaid by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'StartupX', '300')
    const row = invoiceRow('StartupX')
    expect(within(row).getByText('Unpaid')).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: /mark paid startupx/i })).toBeInTheDocument()
  })

  it('Summary total billed increases when a new invoice is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'MegaCorp', '500.00')
    await nav(u, 'Summary')
    // seed billed $1500 + $500 = $2000
    expect(screen.getByText('Total billed: $2000.00')).toBeInTheDocument()
  })

  it('filter state resets when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: 'Unpaid Only' }))
    // filter is local to component; after navigating away and back it resets to All
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    // Globex (Paid) should be visible again because All is the default
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('Summary unpaid count reflects newly added invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Loblaw', '600')
    await nav(u, 'Summary')
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
  })
})
