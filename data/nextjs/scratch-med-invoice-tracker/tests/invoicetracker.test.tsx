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

  it('navigates back to Invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument()
  })

  it('shows seeded invoices on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Bright Ideas')).toBeInTheDocument()
    expect(screen.getByText('Cloud Nine')).toBeInTheDocument()
  })

  it('shows seeded amounts formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('$450.50')).toBeInTheDocument()
    expect(screen.getByText('$875.00')).toBeInTheDocument()
  })

  it('shows Showing: 3 by default with seeded data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('adds a new invoice and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'New Client', '300')
    expect(screen.getByText('New Client')).toBeInTheDocument()
    expect(screen.getByText('$300.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })

  it('new invoice defaults to Unpaid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Fresh Co', '100')
    const items = screen.getAllByText('Unpaid')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('ignores invoice with blank client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Client'))
    await u.type(screen.getByLabelText('Amount'), '500')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('ignores invoice with zero amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Zero Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '0')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.queryByText('Zero Co')).not.toBeInTheDocument()
  })

  it('marks an invoice as paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid acme corp/i }))
    const rows = screen.getAllByText('Paid')
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })

  it('removes Mark Paid button after paying', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid acme corp/i }))
    expect(screen.queryByRole('button', { name: /mark paid acme corp/i })).not.toBeInTheDocument()
  })

  it('filter Unpaid hides paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    expect(screen.queryByText('Bright Ideas')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('filter Paid shows only paid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Paid' }))
    expect(screen.getByText('Bright Ideas')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 3')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 2')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2075.00')).toBeInTheDocument()
    expect(screen.getByText('Total paid: $450.50')).toBeInTheDocument()
  })

  it('Summary updates after marking an invoice paid (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid acme corp/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 1')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $875.00')).toBeInTheDocument()
    expect(screen.getByText('Total paid: $1650.50')).toBeInTheDocument()
  })

  it('Summary updates after adding a new invoice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Delta LLC', '200')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 4')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2275.00')).toBeInTheDocument()
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Invoices')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Persist Co', '999')
    await nav(u, 'Settings')
    await nav(u, 'Invoices')
    expect(screen.getByText('Persist Co')).toBeInTheDocument()
  })
})
