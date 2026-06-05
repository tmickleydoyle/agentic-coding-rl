import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToInvoices(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-invoices'))
}

describe('invoice flow', () => {
  it('lists seeded invoices on the invoices page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    const list = screen.getByTestId('invoice-list')
    expect(within(list).getByTestId('invoice-i1')).toBeInTheDocument()
    expect(within(list).getByTestId('invoice-i2')).toBeInTheDocument()
    expect(within(list).getByTestId('invoice-i3')).toBeInTheDocument()
  })

  it('shows the client name and amount on a row', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    expect(screen.getByTestId('invoice-i1-client')).toHaveTextContent('Acme Co')
    expect(screen.getByTestId('invoice-i1-amount')).toHaveTextContent('1200')
    expect(screen.getByTestId('invoice-i1')).toHaveAttribute('data-status', 'sent')
  })

  it('marks an invoice paid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    expect(screen.getByTestId('invoice-i1')).toHaveAttribute('data-status', 'sent')
    await user.click(screen.getByTestId('mark-paid-i1'))
    expect(screen.getByTestId('invoice-i1')).toHaveAttribute('data-status', 'paid')
    expect(screen.getByTestId('invoice-i1-status')).toHaveTextContent('paid')
  })

  it('deletes an invoice', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    expect(screen.getByTestId('invoice-i3')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-i3'))
    expect(screen.queryByTestId('invoice-i3')).not.toBeInTheDocument()
  })

  it('filters invoices by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'paid')
    expect(screen.getByTestId('invoice-i2')).toBeInTheDocument()
    expect(screen.queryByTestId('invoice-i1')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('status-filter'), 'overdue')
    expect(screen.getByTestId('invoice-i3')).toBeInTheDocument()
    expect(screen.queryByTestId('invoice-i2')).not.toBeInTheDocument()
  })

  it('shows an empty state when no invoice matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToInvoices(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'draft')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('invoice-list')).not.toBeInTheDocument()
  })

  it('blocks submitting an invoice with a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new-invoice'))
    await user.click(screen.getByTestId('submit-invoice'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-new-invoice')).toBeInTheDocument()
  })

  it('adds an invoice and navigates to the invoices list where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new-invoice'))
    await user.selectOptions(screen.getByTestId('client-select'), 'c2')
    await user.type(screen.getByTestId('amount-input'), '300')
    await user.click(screen.getByTestId('submit-invoice'))
    expect(screen.getByTestId('page-invoices')).toBeInTheDocument()
    expect(screen.getByTestId('invoice-i4')).toBeInTheDocument()
    expect(screen.getByTestId('invoice-i4')).toHaveAttribute('data-status', 'draft')
    expect(screen.getByTestId('invoice-i4-amount')).toHaveTextContent('300')
  })
})
