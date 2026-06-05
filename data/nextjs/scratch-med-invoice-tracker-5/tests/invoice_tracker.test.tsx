import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvoice(u: U, client: string, amount: string) {
  await u.clear(screen.getByLabelText('Client'))
  await u.type(screen.getByLabelText('Client'), client)
  await u.clear(screen.getByLabelText('Amount'))
  await u.type(screen.getByLabelText('Amount'), amount)
  await u.click(screen.getByRole('button', { name: /add invoice/i }))
}

function invoiceRow(client: string): HTMLElement {
  const el = screen.getByText(client).closest('li')
  if (!el) throw new Error(`no row for ${client}`)
  return el as HTMLElement
}

describe('Invoice Tracker', () => {
  it('starts on the Invoices view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows outstanding $0.00 initially', () => {
    render(<App />)
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Invoices from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('adds a new invoice and shows it as unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Acme Corp', '150')
    const row = invoiceRow('Acme Corp')
    expect(within(row).getByText('$150.00')).toBeInTheDocument()
    expect(within(row).getByText('unpaid')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('ignores a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Client')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('marks an invoice as paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Beta LLC', '200')
    // uncheck filter to see paid ones too
    await u.click(screen.getByLabelText('Show unpaid only'))
    await u.click(within(invoiceRow('Beta LLC')).getByRole('button', { name: /mark paid/i }))
    expect(within(invoiceRow('Beta LLC')).getByText('paid')).toBeInTheDocument()
  })

  it('Mark paid button disappears after marking paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Gamma Inc', '300')
    await u.click(screen.getByLabelText('Show unpaid only'))
    await u.click(within(invoiceRow('Gamma Inc')).getByRole('button', { name: /mark paid/i }))
    expect(within(invoiceRow('Gamma Inc')).queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument()
  })

  it('outstanding total updates when invoice is marked paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Delta Co', '75')
    expect(screen.getByText('Outstanding: $75.00')).toBeInTheDocument()
    await u.click(within(invoiceRow('Delta Co')).getByRole('button', { name: /mark paid/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('Show unpaid only hides paid invoices by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Epsilon', '50')
    await u.click(within(invoiceRow('Epsilon')).getByRole('button', { name: /mark paid/i }))
    // checkbox is checked by default so paid invoice should be hidden
    expect(screen.queryByText('Epsilon')).not.toBeInTheDocument()
  })

  it('unchecking Show unpaid only reveals paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Zeta Partners', '120')
    await u.click(within(invoiceRow('Zeta Partners')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByText('Zeta Partners')).toBeInTheDocument()
  })

  it('multiple unpaid invoices sum correctly in outstanding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Client A', '100')
    await addInvoice(u, 'Client B', '200')
    await addInvoice(u, 'Client C', '50')
    expect(screen.getByText('Outstanding: $350.00')).toBeInTheDocument()
  })

  it('Summary shows correct totals after adding invoices (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Foo Corp', '500')
    await addInvoice(u, 'Bar Ltd', '250')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Paid: 0')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $750.00')).toBeInTheDocument()
    expect(screen.getByText('Total paid: $0.00')).toBeInTheDocument()
  })

  it('Summary reflects marking an invoice paid (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha Services', '400')
    await addInvoice(u, 'Beta Solutions', '600')
    await u.click(within(invoiceRow('Alpha Services')).getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $600.00')).toBeInTheDocument()
    expect(screen.getByText('Total paid: $400.00')).toBeInTheDocument()
  })

  it('Summary shows zeros when no invoices exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 0')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total paid: $0.00')).toBeInTheDocument()
  })

  it('Settings toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Invoices')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persistent Client', '999')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByText('Persistent Client')).toBeInTheDocument()
  })

  it('outstanding does not include paid invoices in the total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid One', '100')
    await addInvoice(u, 'Unpaid One', '200')
    await u.click(within(invoiceRow('Paid One')).getByRole('button', { name: /mark paid/i }))
    expect(screen.getByText('Outstanding: $200.00')).toBeInTheDocument()
  })
})
