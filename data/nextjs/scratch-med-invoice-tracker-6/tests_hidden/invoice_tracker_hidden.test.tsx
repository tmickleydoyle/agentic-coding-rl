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
  it('all three seed clients are listed on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('marking all unpaid invoices paid zeroes outstanding in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark acme corp paid/i }))
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark initech paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
    expect(screen.getByText('Paid: 3')).toBeInTheDocument()
  })

  it('adding two invoices and paying one reflects correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Massive Dynamic', '400.00')
    await addInvoice(u, 'Cyberdyne', '600.00')
    await u.click(within(invoiceRow('Massive Dynamic')).getByRole('button', { name: /mark massive dynamic paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 5')).toBeInTheDocument()
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $600.50')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2850.00')).toBeInTheDocument()
  })

  it('Show unpaid only hides the seeded paid Globex invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('Show unpaid only does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
  })

  it('new invoice added while filter is on appears after filter is turned off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await addInvoice(u, 'Soylent Corp', '50.00')
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Soylent Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('invoice list state persists through Settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'StayAlive Inc', '77.77')
    await nav(u, 'Settings')
    await nav(u, 'Invoices')
    expect(screen.getByText('StayAlive Inc')).toBeInTheDocument()
    expect(screen.getByText('$77.77')).toBeInTheDocument()
  })

  it('newly added invoice starts as Unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Fresh Co', '250.00')
    expect(within(invoiceRow('Fresh Co')).getByText('Unpaid')).toBeInTheDocument()
    expect(within(invoiceRow('Fresh Co')).getByRole('button', { name: /mark fresh co paid/i })).not.toBeDisabled()
  })

  it('Summary total outstanding only sums unpaid amounts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Acme 1500 + Initech 750 = 2250; Globex is paid
    expect(screen.getByText('Total outstanding: $2250.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $200.50')).toBeInTheDocument()
  })
})
