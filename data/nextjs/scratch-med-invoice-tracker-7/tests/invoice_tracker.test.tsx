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

function invRow(client: string): HTMLElement {
  const el = screen.getByText(client).closest('li')
  if (!el) throw new Error(`no row for ${client}`)
  return el as HTMLElement
}

describe('Invoice Tracker app', () => {
  it('starts on the Invoices view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows seeded invoices on first render', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('shows seeded Acme Corp amount as $1500.00', () => {
    render(<App />)
    expect(within(invRow('Acme Corp')).getByText('$1500.00')).toBeInTheDocument()
  })

  it('shows seeded Globex amount as $250.50', () => {
    render(<App />)
    expect(within(invRow('Globex')).getByText('$250.50')).toBeInTheDocument()
  })

  it('shows initial Outstanding as $1500.00 (only unpaid seed)', () => {
    render(<App />)
    expect(screen.getByText('Outstanding: $1500.00')).toBeInTheDocument()
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

  it('adds a new invoice and shows it with correct formatting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Initech', '800')
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(within(invRow('Initech')).getByText('$800.00')).toBeInTheDocument()
    expect(within(invRow('Initech')).getByText('unpaid')).toBeInTheDocument()
  })

  it('ignores adding an invoice with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    // only 2 seeded rows
    expect(screen.getAllByRole('listitem').length).toBe(2)
  })

  it('marks an invoice as paid and disables the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i })
    expect(btn).not.toBeDisabled()
    await u.click(btn)
    expect(within(invRow('Acme Corp')).getByText('paid')).toBeInTheDocument()
    expect(within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i })).toBeDisabled()
  })

  it('Mark Paid for already-paid Globex is disabled from the start', () => {
    render(<App />)
    expect(within(invRow('Globex')).getByRole('button', { name: /mark paid globex/i })).toBeDisabled()
  })

  it('outstanding updates after marking paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('Show unpaid only hides paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('Show unpaid only still shows outstanding correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Outstanding: $1500.00')).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $1500.00')).toBeInTheDocument()
    expect(screen.getByText('Collection rate: 50%')).toBeInTheDocument()
  })

  it('Summary updates after marking an invoice paid (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Collection rate: 100%')).toBeInTheDocument()
  })

  it('Summary reflects newly added invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Umbrella', '500')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2000.00')).toBeInTheDocument()
  })

  it('Collection rate is 0% with no invoices would show 0 but seeds give 50%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Collection rate: 50%')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
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
    await addInvoice(u, 'Cyberdyne', '999')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Cyberdyne')).toBeInTheDocument()
  })
})
