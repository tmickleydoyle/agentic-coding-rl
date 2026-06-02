// HELD-OUT generalization tests — fresh scenarios testing edge cases and cross-view paths.
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
  it('adds multiple invoices and count reflects all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha', '100')
    await addInvoice(u, 'Beta', '200')
    await addInvoice(u, 'Gamma', '300')
    expect(screen.getByRole('heading', { name: /invoices \(3\)/i })).toBeInTheDocument()
  })

  it('outstanding is zero when all invoices are paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Solo', '75.50')
    await u.click(within(invoiceRow('Solo')).getByRole('button', { name: /mark paid solo/i }))
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('summary unpaid count decreases after marking paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'One', '50')
    await addInvoice(u, 'Two', '50')
    await u.click(within(invoiceRow('One')).getByRole('button', { name: /mark paid one/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
  })

  it('paid rate rounds correctly for three invoices one paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'P1', '100')
    await addInvoice(u, 'P2', '100')
    await addInvoice(u, 'P3', '100')
    await u.click(within(invoiceRow('P1')).getByRole('button', { name: /mark paid p1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 33%')).toBeInTheDocument()
  })

  it('unchecking show unpaid only reveals paid invoices again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Visible', '100')
    await u.click(within(invoiceRow('Visible')).getByRole('button', { name: /mark paid visible/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.queryByText('Visible')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText('Show unpaid only'))
    expect(screen.getByText('Visible')).toBeInTheDocument()
  })

  it('amount is formatted to two decimal places', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Decimal Co', '49.9')
    expect(screen.getByText('$49.90')).toBeInTheDocument()
  })

  it('summary total outstanding matches sum of unpaid amounts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'C1', '250')
    await addInvoice(u, 'C2', '350')
    await addInvoice(u, 'C3', '100')
    await u.click(within(invoiceRow('C2')).getByRole('button', { name: /mark paid c2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $350.00')).toBeInTheDocument()
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

  it('all three invoices paid yields 100% paid rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'X', '10')
    await addInvoice(u, 'Y', '20')
    await addInvoice(u, 'Z', '30')
    await u.click(within(invoiceRow('X')).getByRole('button', { name: /mark paid x/i }))
    await u.click(within(invoiceRow('Y')).getByRole('button', { name: /mark paid y/i }))
    await u.click(within(invoiceRow('Z')).getByRole('button', { name: /mark paid z/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('show unpaid only checkbox state persists after navigating and returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'PaidInv', '55')
    await u.click(within(invoiceRow('PaidInv')).getByRole('button', { name: /mark paid paidinv/i }))
    await u.click(screen.getByLabelText('Show unpaid only'))
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    const checkbox = screen.getByLabelText('Show unpaid only') as HTMLInputElement
    expect(checkbox.checked).toBe(true)
    expect(screen.queryByText('PaidInv')).not.toBeInTheDocument()
  })
})
