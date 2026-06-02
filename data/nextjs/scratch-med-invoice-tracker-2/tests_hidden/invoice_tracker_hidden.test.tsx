import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('adding multiple invoices shows correct total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Corp X', '100')
    await addInvoice(u, 'Corp Y', '200')
    await addInvoice(u, 'Corp Z', '300')
    expect(screen.getByText('Showing 3 of 3 invoices')).toBeInTheDocument()
  })

  it('marking all invoices paid updates Summary collected total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'A', '120')
    await addInvoice(u, 'B', '80')
    const markPaidBtns = screen.getAllByRole('button', { name: /mark paid/i })
    await u.click(markPaidBtns[0])
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total collected: $200.00')).toBeInTheDocument()
    expect(screen.getByText('Total outstanding: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Paid: 2')).toBeInTheDocument()
    expect(screen.getByText('Unpaid: 0')).toBeInTheDocument()
  })

  it('filter shows 0 visible when all are paid and Show unpaid only is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Only Paid', '400')
    await u.click(screen.getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByLabelText(/show unpaid only/i))
    expect(screen.getByText('Showing 0 of 1 invoices')).toBeInTheDocument()
  })

  it('ignores invoice with negative amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Client'), 'Negative Co')
    await u.clear(screen.getByLabelText('Amount'))
    await u.type(screen.getByLabelText('Amount'), '-50')
    await u.click(screen.getByRole('button', { name: /add invoice/i }))
    expect(screen.getByText('Showing 0 of 0 invoices')).toBeInTheDocument()
  })

  it('Summary outstanding reflects only unpaid invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Will Pay', '300')
    await addInvoice(u, 'Wont Pay', '700')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $700.00')).toBeInTheDocument()
    expect(screen.getByText('Total collected: $300.00')).toBeInTheDocument()
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

  it('adding invoice with decimal amount formats correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Decimal Corp', '99.5')
    await nav(u, 'Summary')
    expect(screen.getByText('Total outstanding: $99.50')).toBeInTheDocument()
  })

  it('Showing count with filter off equals total invoices', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'One', '10')
    await addInvoice(u, 'Two', '20')
    await u.click(screen.getAllByRole('button', { name: /mark paid/i })[0])
    expect(screen.getByText('Showing 2 of 2 invoices')).toBeInTheDocument()
  })

  it('Show unpaid only does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvoice(u, 'Filtered Out', '500')
    await u.click(screen.getByRole('button', { name: /mark paid/i }))
    await u.click(screen.getByLabelText(/show unpaid only/i))
    await nav(u, 'Summary')
    expect(screen.getByText('Total invoices: 1')).toBeInTheDocument()
    expect(screen.getByText('Paid: 1')).toBeInTheDocument()
  })
})
