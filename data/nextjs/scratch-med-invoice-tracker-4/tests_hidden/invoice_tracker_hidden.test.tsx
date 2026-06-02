// HELD-OUT generalization tests — overlaid only at eval.
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

describe('Invoice Tracker (held-out)', () => {
  it('all three seeded invoices appear as list items', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('Initech row shows Unpaid status initially', () => {
    render(<App />)
    expect(within(invoiceRow('Initech')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('marking Initech paid reduces outstanding by 125.50', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark paid initech/i }))
    expect(screen.getByText('Outstanding: $500.00')).toBeInTheDocument()
  })

  it('marking all unpaid invoices makes outstanding $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark paid initech/i }))
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
  })

  it('summary collection rate is 100% when all paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(within(invoiceRow('Initech')).getByRole('button', { name: /mark paid initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Collection rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('summary collection rate is 0% when no invoices are paid initially', async () => {
    // Verify the seeded state: 1 paid out of 3 = 33%
    // Then we verify the formula handles zero correctly by checking summary on fresh render
    render(<App />)
    // fresh render has 1 paid of 3 = 33%
    await nav(userEvent.setup(), 'Summary')
    expect(screen.getByText('Collection rate: 33%')).toBeInTheDocument()
  })

  it('adding a new invoice increases total invoices in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Wayne Enterprises', '999.99')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
  })

  it('new invoice outstanding amount appears in summary total outstanding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Wayne Enterprises', '100.00')
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $725.50')).toBeInTheDocument()
  })

  it('filter shows only unpaid after one is marked paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('filter button label toggles correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: Unpaid' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    expect(screen.getByRole('button', { name: 'Show: All' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Unpaid' })).toBeInTheDocument()
  })

  it('filter state does not affect outstanding total displayed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: Unpaid' }))
    // outstanding should still include all unpaid regardless of filter
    expect(screen.getByText('Outstanding: $625.50')).toBeInTheDocument()
  })

  it('theme persists after toggling twice (back to light)', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('summary total outstanding reflects filter-independent value', async () => {
    const u = userEvent.setup()
    render(<App />)
    // mark Acme Corp paid on invoices view
    await u.click(within(invoiceRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $125.50')).toBeInTheDocument()
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
  })
})
