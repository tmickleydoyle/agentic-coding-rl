// HELD-OUT generalization tests — fresh scenarios and edge cases.
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

describe('Invoice Tracker (held-out)', () => {
  it('adding two new invoices increases total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Weyland', '300')
    await addInvoice(u, 'Tyrell', '450')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
  })

  it('outstanding reflects multiple unpaid invoices correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Soylent', '200')
    // Acme Corp 1500 + Soylent 200 = 1700
    expect(screen.getByText('Outstanding: $1700.00')).toBeInTheDocument()
  })

  it('marking all invoices paid gives Collection rate 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Collection rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
  })

  it('unpaid filter unchecked shows all invoices including paid Globex', async () => {
    const u = userEvent.setup()
    render(<App />)
    // default: unchecked, all shown
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('unpaid filter hides newly paid invoice too', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Rekall', '750')
    await u.click(within(invRow('Rekall')).getByRole('button', { name: /mark paid rekall/i }))
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.queryByText('Rekall')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('Summary Unpaid count updates after multiple marks paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Oscorp', '100')
    await u.click(within(invRow('Acme Corp')).getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(within(invRow('Oscorp')).getByRole('button', { name: /mark paid oscorp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 3')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
  })

  it('re-unchecking show unpaid only restores paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('Summary paid count includes seeded Globex paid invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
  })

  it('theme toggle second time reverts to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('new invoice status is unpaid and shown in Summary unpaid count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'LexCorp', '1200')
    expect(within(invRow('LexCorp')).getByText('unpaid')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
  })

  it('invoice amount with decimals formats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Primatech', '99.9')
    expect(within(invRow('Primatech')).getByText('$99.90')).toBeInTheDocument()
  })
})
