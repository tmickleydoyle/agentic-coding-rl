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

describe('Invoice Tracker', () => {
  it('starts on the Invoices view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows Showing 0 of 0 invoices on load', () => {
    render(<App />)
    expect(screen.getByText('Showing 0 of 0 invoices')).toBeInTheDocument()
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

  it('adds an invoice and shows it as Unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Acme Corp', '150')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getByText('Unpaid')).toBeInTheDocument()
  })

  it('updates the Showing count after adding an invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Beta LLC', '200')
    expect(screen.getByText('Showing 1 of 1 invoices')).toBeInTheDocument()
  })

  it('ignores an invoice with a blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '100')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing 0 of 0 invoices')).toBeInTheDocument()
  })

  it('ignores an invoice with a zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Ghost')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing 0 of 0 invoices')).toBeInTheDocument()
  })

  it('marks an invoice as paid and hides the Mark Paid button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Gamma Inc', '300')
    await u.click(screen.getByRole('button', { name: /mark paid/i }))
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument()
  })

  it('filters to unpaid only when checkbox is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha', '100')
    await addInvoice(u, 'Beta', '200')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Showing 1 of 2 invoices')).toBeInTheDocument()
    expect(screen.queryByText('Paid')).not.toBeInTheDocument()
  })

  it('restores all invoices when Show unpaid only is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha', '100')
    await addInvoice(u, 'Beta', '200')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Showing 2 of 2 invoices')).toBeInTheDocument()
  })

  it('Summary shows correct totals after adding invoices (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Client A', '100')
    await addInvoice(u, 'Client B', '250')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 2')).toBeInTheDocument()
    expect(screen.getByText('Paid: 0')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $350.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $0.00')).toBeInTheDocument()
  })

  it('Summary updates when an invoice is marked paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Client A', '100')
    await addInvoice(u, 'Client B', '250')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
  })

  it('Summary shows $0.00 outstanding when all invoices are paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Solo Client', '500')
    await u.click(screen.getByRole('button', { name: /mark paid/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $500.00')).toBeInTheDocument()
  })

  it('Summary shows zero totals on fresh load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 0')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $0.00')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Invoices')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('invoice list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persistent Co', '999')
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
    expect(screen.getByText('$999.00')).toBeInTheDocument()
  })

  it('Show unpaid only filter state persists across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Paid One', '50')
    await addInvoice(u, 'Unpaid One', '75')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Showing 1 of 2 invoices')).toBeInTheDocument()
  })

  it('formats invoice amount with two decimal places', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Decimal Test', '49.9')
    expect(screen.getByText('$49.90')).toBeInTheDocument()
  })
})
