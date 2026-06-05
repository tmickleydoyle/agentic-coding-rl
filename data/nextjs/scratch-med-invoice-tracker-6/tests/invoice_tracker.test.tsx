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

describe('Invoice Tracker app', () => {
  it('starts on the Invoices view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows seeded invoices on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('displays seeded amounts formatted to two decimal places', () => {
    render(<App />)
    expect(screen.getByText('$1500.00')).toBeInTheDocument()
    expect(screen.getByText('$200.50')).toBeInTheDocument()
    expect(screen.getByText('$750.00')).toBeInTheDocument()
  })

  it('shows correct initial paid/unpaid badges', () => {
    render(<App />)
    expect(within(invoiceRow('Acme Corp')).getByText('Unpaid')).toBeInTheDocument()
    expect(within(invoiceRow('Globex')).getByText('Paid')).toBeInTheDocument()
    expect(within(invoiceRow('Initech')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('Mark Paid button is disabled for already-paid invoices', () => {
    render(<App />)
    expect(within(invoiceRow('Globex')).getByRole('button', { name: /mark globex paid/i })).toBeDisabled()
  })

  it('Mark Paid button is enabled for unpaid invoices', () => {
    render(<App />)
    expect(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark acme corp paid/i })).not.toBeDisabled()
  })

  it('marks an invoice as paid and disables the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark acme corp paid/i }))
    expect(within(invoiceRow('Acme Corp')).getByText('Paid')).toBeInTheDocument()
    expect(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark acme corp paid/i })).toBeDisabled()
  })

  it('adds a new invoice and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Umbrella Corp', '999.99')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$999.99')).toBeInTheDocument()
    expect(within(invoiceRow('Umbrella Corp')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('ignores submission with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('ignores submission with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Client')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.queryByText('Ghost Client')).not.toBeInTheDocument()
  })

  it('filters to unpaid only when Show unpaid only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('unchecking Show unpaid only restores all invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('Summary shows correct initial totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2250.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $200.50')).toBeInTheDocument()
  })

  it('marking an invoice paid updates Summary outstanding and collected (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark initech paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $1500.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $950.50')).toBeInTheDocument()
  })

  it('adding a new invoice updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Vandelay', '300.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2550.00')).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('starts with light theme', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles to dark theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Invoices')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persistco', '123.45')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persistco')).toBeInTheDocument()
  })

  it('paid invoice is hidden when filter is on and shown after marking paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark acme corp paid/i }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })
})
