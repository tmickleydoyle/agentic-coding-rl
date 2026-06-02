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

describe('Invoice Tracker (held-out)', () => {
  it('all three seeded invoices visible on load with Showing: 3', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Bright Ideas is seeded as Paid and has no Mark Paid button', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /mark paid bright ideas/i })).not.toBeInTheDocument()
  })

  it('Cloud Nine is seeded as Unpaid and has a Mark Paid button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /mark paid cloud nine/i })).toBeInTheDocument()
  })

  it('paying Cloud Nine reflects in Unpaid filter count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid cloud nine/i }))
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Cloud Nine')).not.toBeInTheDocument()
  })

  it('paying both unpaid invoices leaves Total outstanding: $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid acme corp/i }))
    await u.click(screen.getByRole('button', { name: /mark paid cloud nine/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
    expect(screen.getByText('Paid: 3')).toBeInTheDocument()
  })

  it('filter Paid count increases after marking an invoice paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Paid' }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    await u.click(screen.getByRole('button', { name: /mark paid cloud nine/i }))
    await u.click(screen.getByRole('button', { name: 'Paid' }))
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('adding an invoice and viewing Summary updates Total invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Sigma Labs', '500')
    await addInvoice(u, 'Theta Works', '750')
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 5')).toBeInTheDocument()
  })

  it('new invoices added are counted as unpaid in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Alpha Co', '123.45')
    await nav(u, 'Summary')
    expect(screen.getByText('Unpaid: 3')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $2198.45')).toBeInTheDocument()
  })

  it('ignores negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Bad Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-50')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.queryByText('Bad Co')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Summary Total paid updates after marking invoice paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark paid cloud nine/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total paid: $1325.50')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Unpaid filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpaid' }))
    await nav(u, 'Summary')
    await nav(u, 'Invoices')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })
})
