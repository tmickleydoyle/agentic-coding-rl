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

describe('Invoice Tracker app', () => {
  it('starts on the Invoices view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
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

  it('shows Showing: 0 when no invoices', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('adds an invoice and shows it with formatted amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Acme Corp', '250')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(within(invoiceRow('Acme Corp')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('shows Showing: 1 after adding one invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Beta LLC', '100')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores invoice with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('ignores invoice with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('marks an invoice as paid and hides the Mark Paid button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Delta Inc', '400')
    await u.click(within(invoiceRow('Delta Inc')).getByRole('button', { name: /mark paid/i }))
    expect(within(invoiceRow('Delta Inc')).getByText('Paid')).toBeInTheDocument()
    expect(within(invoiceRow('Delta Inc')).queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument()
  })

  it('filters to show only Unpaid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Client A', '100')
    await addInvoice(u, 'Client B', '200')
    await u.click(within(invoiceRow('Client A')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.queryByText('Client A')).not.toBeInTheDocument()
    expect(screen.getByText('Client B')).toBeInTheDocument()
  })

  it('filters to show only Paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid One', '50')
    await addInvoice(u, 'Unpaid One', '75')
    await u.click(within(invoiceRow('Paid One')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByRole('button', { name: 'Paid' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Paid One')).toBeInTheDocument()
    expect(screen.queryByText('Unpaid One')).not.toBeInTheDocument()
  })

  it('shows All resets the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'X Corp', '300')
    await addInvoice(u, 'Y Corp', '400')
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('Summary shows zero totals with no invoices (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 0')).toBeInTheDocument()
    expect(screen.getByText('Paid: 0')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Collected: $0.00')).toBeInTheDocument()
  })

  it('Summary reflects added invoices (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Acme', '500')
    await addInvoice(u, 'Globex', '300')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Outstanding: $800.00')).toBeInTheDocument()
    expect(screen.getByText('Collected: $0.00')).toBeInTheDocument()
  })

  it('Summary updates after marking paid (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Foo Bar', '120')
    await addInvoice(u, 'Baz Qux', '80')
    await u.click(within(invoiceRow('Foo Bar')).getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Outstanding: $80.00')).toBeInTheDocument()
    expect(screen.getByText('Collected: $120.00')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
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
    await nav(u, 'Invoices')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('invoice list state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persisted Client', '999')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persisted Client')).toBeInTheDocument()
    expect(screen.getByText('$999.00')).toBeInTheDocument()
  })

  it('formats decimal amounts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Decimal Co', '49.5')
    expect(screen.getByText('$49.50')).toBeInTheDocument()
  })
})
