// HELD-OUT generalization tests — fresh scenarios not visible during development.
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
  it('adding three invoices shows Showing: 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha', '100')
    await addInvoice(u, 'Beta', '200')
    await addInvoice(u, 'Gamma', '300')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('marking all invoices paid shows Unpaid filter with Showing: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Solo', '150')
    await u.click(within(invoiceRow('Solo')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('Summary outstanding is $0.00 when all invoices are paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Omega', '250')
    await u.click(within(invoiceRow('Omega')).getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Collected: $250.00')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
  })

  it('Summary total invoices matches multiple added invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'One', '10')
    await addInvoice(u, 'Two', '20')
    await addInvoice(u, 'Three', '30')
    await addInvoice(u, 'Four', '40')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
  })

  it('negative amount is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Bad Client')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-50')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('Paid filter count updates after marking multiple invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'First', '100')
    await addInvoice(u, 'Second', '200')
    await addInvoice(u, 'Third', '300')
    await u.click(within(invoiceRow('First')).getByRole('button', { name: /mark paid/i }))
    await u.click(within(invoiceRow('Third')).getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByRole('button', { name: 'Paid' }))
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
    expect(screen.queryByText('Second')).not.toBeInTheDocument()
  })

  it('Summary outstanding sums only unpaid amounts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'PayMe', '400')
    await addInvoice(u, 'NotYet', '600')
    await u.click(within(invoiceRow('PayMe')).getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Outstanding: $600.00')).toBeInTheDocument()
    expect(screen.getByText('Collected: $400.00')).toBeInTheDocument()
  })

  it('theme toggle can be switched twice back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Unpaid badge is shown on newly added invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'New Client', '75')
    expect(within(invoiceRow('New Client')).getByText('Unpaid')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Stay Unpaid', '111')
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })
})
