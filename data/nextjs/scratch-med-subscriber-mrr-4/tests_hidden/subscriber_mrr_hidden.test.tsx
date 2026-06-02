// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSubscriber(u: U, name: string, plan?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (plan) {
    await u.selectOptions(screen.getByLabelText('Plan'), plan)
  }
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

function subRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('active count reflects mixed active/inactive correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Pam', 'Pro ($79/mo)')
    await addSubscriber(u, 'Quinn', 'Starter ($29/mo)')
    await addSubscriber(u, 'Rita', 'Enterprise ($199/mo)')
    await u.click(within(subRow('Pam')).getByLabelText(/active pam/i))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('re-activating a subscriber updates MRR on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Sam', 'Pro ($79/mo)')
    await u.click(within(subRow('Sam')).getByLabelText(/active sam/i)) // deactivate
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $0')).toBeInTheDocument()
    await nav(u, 'Subscribers')
    await u.click(within(subRow('Sam')).getByLabelText(/active sam/i)) // reactivate
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $79')).toBeInTheDocument()
  })

  it('removing one of two subscribers reduces total and MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Tara', 'Enterprise ($199/mo)')
    await addSubscriber(u, 'Uma', 'Starter ($29/mo)')
    await u.click(within(subRow('Tara')).getByRole('button', { name: /remove tara/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $29')).toBeInTheDocument()
  })

  it('ARPU rounds correctly for three subscribers of different plans', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'V1', 'Starter ($29/mo)')
    await addSubscriber(u, 'V2', 'Starter ($29/mo)')
    await addSubscriber(u, 'V3', 'Pro ($79/mo)')
    // MRR = 29+29+79 = 137, active = 3, ARPU = Math.round(137/3) = 46
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue (MRR): $137')).toBeInTheDocument()
    expect(screen.getByText('Average Revenue per User (ARPU): $46')).toBeInTheDocument()
  })

  it('unhiding inactive shows previously hidden subscriber again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Wendy', 'Starter ($29/mo)')
    await u.click(within(subRow('Wendy')).getByLabelText(/active wendy/i))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i)) // hide
    await nav(u, 'Subscribers')
    expect(screen.queryByText('Wendy')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i)) // unhide
    await nav(u, 'Subscribers')
    expect(screen.getByText('Wendy')).toBeInTheDocument()
  })

  it('dashboard inactive count updates after removing an inactive subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Xander', 'Pro ($79/mo)')
    await u.click(within(subRow('Xander')).getByLabelText(/active xander/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Inactive Subscribers: 1')).toBeInTheDocument()
    await nav(u, 'Subscribers')
    await u.click(within(subRow('Xander')).getByRole('button', { name: /remove xander/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Inactive Subscribers: 0')).toBeInTheDocument()
  })

  it('active count shows correctly after removing active subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Yara', 'Enterprise ($199/mo)')
    await addSubscriber(u, 'Zack', 'Starter ($29/mo)')
    await u.click(within(subRow('Yara')).getByRole('button', { name: /remove yara/i }))
    expect(screen.getByText('Active: 1 of 1')).toBeInTheDocument()
  })

  it('theme button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })
})
