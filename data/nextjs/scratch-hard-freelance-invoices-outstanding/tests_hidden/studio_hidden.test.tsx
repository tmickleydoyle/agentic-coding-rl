// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function logInvoice(u: U, label: string, amount: string, days: string, client: string) {
  await u.clear(screen.getByLabelText(/invoice label/i))
  await u.type(screen.getByLabelText(/invoice label/i), label)
  await u.clear(screen.getByLabelText(/amount/i))
  await u.type(screen.getByLabelText(/amount/i), amount)
  await u.clear(screen.getByLabelText(/days old/i))
  await u.type(screen.getByLabelText(/days old/i), days)
  await u.selectOptions(screen.getByLabelText(/^client$/i), client)
  await u.click(screen.getByRole('button', { name: /log invoice/i }))
}
const clientsView = () => screen.getByRole('region', { name: 'Clients view' })
const reportsView = () => screen.getByRole('region', { name: 'Reports view' })

describe('Freelance invoicing (held-out)', () => {
  it('marking paid moves dollars out of a client balance live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'Retainer', '900', '5', 'Beanstalk')
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Beanstalk: $900 outstanding across 1 unpaid'),
    ).toBeInTheDocument()
    await nav(u, 'Invoices')
    await u.click(screen.getByRole('button', { name: 'Mark Retainer paid' }))
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Beanstalk: $0 outstanding across 0 unpaid'),
    ).toBeInTheDocument()
  })

  it('aggregates two invoices in the same bucket', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'X', '100', '40', 'Acme Co')
    await logInvoice(u, 'Y', '150', '55', 'Cogwheel')
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Overdue (31-60): $250')).toBeInTheDocument()
  })

  it('a newly added client can be invoiced and tracked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Clients')
    await u.type(screen.getByLabelText(/client name/i), 'Echo Labs')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    await nav(u, 'Invoices')
    await logInvoice(u, 'Kickoff', '350', '12', 'Echo Labs')
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Echo Labs: $350 outstanding across 1 unpaid'),
    ).toBeInTheDocument()
  })

  it('keeps each client outstanding independent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logInvoice(u, 'A1', '500', '5', 'Acme Co')
    await logInvoice(u, 'C1', '200', '5', 'Cogwheel')
    await nav(u, 'Clients')
    expect(
      within(clientsView()).getByText('Acme Co: $500 outstanding across 1 unpaid'),
    ).toBeInTheDocument()
    expect(
      within(clientsView()).getByText('Cogwheel: $200 outstanding across 1 unpaid'),
    ).toBeInTheDocument()
  })
})
