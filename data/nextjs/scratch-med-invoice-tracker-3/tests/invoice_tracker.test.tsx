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

  it('renders all three seeded invoices on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows correct seeded amounts', () => {
    render(<App />)
    expect(screen.getByText('$500.00')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(screen.getByText('$750.00')).toBeInTheDocument()
  })

  it('shows correct initial outstanding total', () => {
    render(<App />)
    expect(screen.getByText('Outstanding: $1250.00')).toBeInTheDocument()
  })

  it('Globex seeded as Paid shows no Mark Paid button', () => {
    render(<App />)
    const row = invoiceRow('Globex')
    expect(within(row).queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument()
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

  it('adds a new invoice and shows it unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Wayne Enterprises', '999.99')
    const row = invoiceRow('Wayne Enterprises')
    expect(within(row).getByText('$999.99')).toBeInTheDocument()
    expect(within(row).getByText('Unpaid')).toBeInTheDocument()
  })

  it('ignores invoice with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('ignores invoice with blank amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost Corp')
    await u.clear(screen.getByLabelText('Amount'))
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('ignores invoice with zero or negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Bad Corp', '-50')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('marks an unpaid invoice as paid and removes its Mark Paid button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = invoiceRow('Acme Corp')
    expect(within(row).getByText('Unpaid')).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /mark paid acme corp/i }))
    expect(within(invoiceRow('Acme Corp')).getByText('Paid')).toBeInTheDocument()
    expect(within(invoiceRow('Acme Corp')).queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument()
  })

  it('updates outstanding total after marking an invoice paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    expect(screen.getByText('Outstanding: $750.00')).toBeInTheDocument()
  })

  it('filter Unpaid Only hides paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: 'Unpaid Only' }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('switching back to All filter shows all invoices again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: 'Unpaid Only' }))
    await u.click(screen.getByRole('radio', { name: 'All' }))
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total billed: $1500.00')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $1250.00')).toBeInTheDocument()
    expect(screen.getByText('Paid rate: 33%')).toBeInTheDocument()
  })

  it('Summary updates after marking an invoice paid (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $750.00')).toBeInTheDocument()
    expect(screen.getByText('Paid rate: 67%')).toBeInTheDocument()
  })

  it('Summary updates after adding a new invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Umbrella Corp', '300.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
    expect(screen.getByText('Total billed: $1800.00')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $1550.00')).toBeInTheDocument()
  })

  it('toggles theme and persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('invoice state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persist Co', '100.00')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persist Co')).toBeInTheDocument()
  })
})
