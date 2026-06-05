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

describe('Invoice Tracker (held-out)', () => {
  it('amount is formatted with two decimal places', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Decimal Corp', '99.5')
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(within(invoiceRow('Decimal Corp')).getByText('$99.50')).toBeInTheDocument()
  })

  it('marking all invoices paid brings outstanding to $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'X Corp', '300')
    await addInvoice(u, 'Y Corp', '700')
    await u.click(within(invoiceRow('X Corp')).getByRole('button', { name: /mark paid/i }))
    await u.click(within(invoiceRow('Y Corp')).getByRole('button', { name: /mark paid/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('summary paid total sums multiple paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'P1', '100')
    await addInvoice(u, 'P2', '150')
    await addInvoice(u, 'P3', '250')
    await u.click(within(invoiceRow('P1')).getByRole('button', { name: /mark paid/i }))
    await u.click(within(invoiceRow('P2')).getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total paid: $250.00')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $250.00')).toBeInTheDocument()
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
  })

  it('unchecking filter shows both paid and unpaid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Visible Paid', '50')
    await addInvoice(u, 'Visible Unpaid', '80')
    await u.click(within(invoiceRow('Visible Paid')).getByRole('button', { name: /mark paid/i }))
    // by default paid is hidden; uncheck to show all
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByText('Visible Paid')).toBeInTheDocument()
    expect(screen.getByText('Visible Unpaid')).toBeInTheDocument()
  })

  it('re-checking Show unpaid only hides paid invoices again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Toggle Client', '60')
    await u.click(within(invoiceRow('Toggle Client')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByLabelText('Show unpaid only')) // uncheck
    expect(screen.getByText('Toggle Client')).toBeInTheDocument()
    await u.click(screen.getByLabelText('Show unpaid only')) // re-check
    expect(screen.queryByText('Toggle Client')).not.toBeInTheDocument()
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

  it('summary updates after returning and adding another invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'First Client', '100')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 1')).toBeInTheDocument()
    await nav(u, 'Invoices')
    await addInvoice(u, 'Second Client', '200')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $300.00')).toBeInTheDocument()
  })

  it('new invoice status shows as unpaid text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Status Check', '45')
    expect(within(invoiceRow('Status Check')).getByText('unpaid')).toBeInTheDocument()
  })

  it('outstanding only counts unpaid when some are paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid Client', '1000')
    await addInvoice(u, 'Owed Client', '333')
    await u.click(within(invoiceRow('Paid Client')).getByRole('button', { name: /mark paid/i }))
    expect(screen.getByText('Outstanding: $333.00')).toBeInTheDocument()
  })
})
