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
    expect(screen.getByRole('heading', { name: /invoices \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Invoices view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByRole('heading', { name: /invoices \(0\)/i })).toBeInTheDocument()
  })

  it('adds an invoice and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Acme Corp', '150.00')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /invoices \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '50')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByRole('heading', { name: /invoices \(0\)/i })).toBeInTheDocument()
  })

  it('ignores a zero or negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByRole('heading', { name: /invoices \(0\)/i })).toBeInTheDocument()
  })

  it('new invoice starts as unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Beta LLC', '200')
    expect(within(invoiceRow('Beta LLC')).getByText('unpaid')).toBeInTheDocument()
  })

  it('marks an invoice as paid and disables the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Delta Inc', '300')
    const btn = within(invoiceRow('Delta Inc')).getByRole('button', { name: /mark paid delta inc/i })
    expect(btn).not.toBeDisabled()
    await u.click(btn)
    expect(within(invoiceRow('Delta Inc')).getByText('paid')).toBeInTheDocument()
    expect(within(invoiceRow('Delta Inc')).getByRole('button', { name: /mark paid delta inc/i })).toBeDisabled()
  })

  it('total outstanding updates when an invoice is marked paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Foo', '100')
    await addInvoice(u, 'Bar', '50')
    expect(screen.getByText('Total outstanding: $150.00')).toBeInTheDocument()
    await u.click(within(invoiceRow('Foo')).getByRole('button', { name: /mark paid foo/i }))
    expect(screen.getByText('Total outstanding: $50.00')).toBeInTheDocument()
  })

  it('show unpaid only hides paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alice', '80')
    await addInvoice(u, 'Bob', '120')
    await u.click(within(invoiceRow('Alice')).getByRole('button', { name: /mark paid alice/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('heading count includes all invoices even when filter is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alice', '80')
    await addInvoice(u, 'Bob', '120')
    await u.click(within(invoiceRow('Alice')).getByRole('button', { name: /mark paid alice/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByRole('heading', { name: /invoices \(2\)/i })).toBeInTheDocument()
  })

  it('total outstanding on invoices view counts unpaid only regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid One', '500')
    await addInvoice(u, 'Unpaid One', '250')
    await u.click(within(invoiceRow('Paid One')).getByRole('button', { name: /mark paid paid one/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByText('Total outstanding: $250.00')).toBeInTheDocument()
  })

  it('summary shows correct totals cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Client A', '400')
    await addInvoice(u, 'Client B', '600')
    await u.click(within(invoiceRow('Client A')).getByRole('button', { name: /mark paid client a/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $600.00')).toBeInTheDocument()
    expect(screen.getByText('Paid rate: 50%')).toBeInTheDocument()
  })

  it('summary shows 0% paid rate when no invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 0')).toBeInTheDocument()
    expect(screen.getByText('Paid rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('summary updates after marking paid cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'X Corp', '1000')
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 0%')).toBeInTheDocument()
    await nav(u, 'Invoices')
    await u.click(within(invoiceRow('X Corp')).getByRole('button', { name: /mark paid x corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
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

  it('theme persists across view navigation', async () => {
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

  it('invoice list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persistent Co', '999')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /invoices \(1\)/i })).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid Co', '100')
    await u.click(within(invoiceRow('Paid Co')).getByRole('button', { name: /mark paid paid co/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    await nav(u, 'Settings')
    await nav(u, 'Invoices')
    expect(screen.queryByText('Paid Co')).not.toBeInTheDocument()
  })
})
