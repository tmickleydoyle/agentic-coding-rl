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
  const span = screen.getByText(client)
  const li = span.closest('li')
  if (!li) throw new Error(`no row for ${client}`)
  return li as HTMLElement
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

  it('navigates back to Invoices view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows seeded invoices on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('displays amounts formatted with two decimal places', () => {
    render(<App />)
    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(screen.getByText('$125.50')).toBeInTheDocument()
  })

  it('shows correct initial outstanding total', () => {
    render(<App />)
    expect(screen.getByText('Outstanding: $625.50')).toBeInTheDocument()
  })

  it('Globex row shows Paid status', () => {
    render(<App />)
    const row = invoiceRow('Globex')
    expect(within(row).getByText('Paid')).toBeInTheDocument()
  })

  it('Mark Paid button is disabled for already-paid invoice', () => {
    render(<App />)
    const row = invoiceRow('Globex')
    expect(within(row).getByRole('button', { name: /mark paid globex/i })).toBeDisabled()
  })

  it('Mark Paid button is enabled for unpaid invoice', () => {
    render(<App />)
    const row = invoiceRow('Acme Corp')
    expect(within(row).getByRole('button', { name: /mark paid acme corp/i })).not.toBeDisabled()
  })

  it('marks an invoice as paid and updates status', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = invoiceRow('Acme Corp')
    await u.click(within(row).getByRole('button', { name: /mark paid acme corp/i }))
    expect(within(invoiceRow('Acme Corp')).getByText('Paid')).toBeInTheDocument()
    expect(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i })).toBeDisabled()
  })

  it('outstanding total updates after marking paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    expect(screen.getByText('Outstanding: $125.50')).toBeInTheDocument()
  })

  it('adds a new invoice to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Umbrella Ltd', '300.00')
    expect(screen.getByText('Umbrella Ltd')).toBeInTheDocument()
    expect(screen.getByText('$300.00')).toBeInTheDocument()
  })

  it('new invoice starts as Unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Umbrella Ltd', '300.00')
    expect(within(invoiceRow('Umbrella Ltd')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('ignores a zero or negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.queryByText('Ghost Co')).not.toBeInTheDocument()
  })

  it('filter button shows Show: Unpaid initially', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: Unpaid' })).toBeInTheDocument()
  })

  it('filtering to unpaid hides paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('toggling filter back to all restores paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('outstanding total is always shown regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    expect(screen.getByText('Outstanding: $625.50')).toBeInTheDocument()
  })

  it('summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $625.50')).toBeInTheDocument()
    expect(screen.getByText('Collection rate: 33%')).toBeInTheDocument()
  })

  it('summary updates after marking an invoice paid (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $125.50')).toBeInTheDocument()
    expect(screen.getByText('Collection rate: 67%')).toBeInTheDocument()
  })

  it('theme toggles via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Invoices')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('invoice list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persistent Co', '75.00')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
  })
})
