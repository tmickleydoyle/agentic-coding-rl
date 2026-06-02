// HELD-OUT generalization tests — fresh cross-view scenarios.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSub(u: U, name: string, plan?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (plan) await u.selectOptions(screen.getByLabelText('Plan'), plan)
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('seed data: Carol shows Inactive toggle button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /toggle active for carol/i })).toHaveTextContent('Inactive')
  })

  it('toggle Carol active then Dashboard shows Enterprise $199 added to MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle active for carol/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $307')).toBeInTheDocument()
    expect(screen.getByText('Active rate: 100%')).toBeInTheDocument()
  })

  it('remove Carol (inactive) does not change MRR but decreases inactive count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove carol/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $108')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Total subscribers: 2')).toBeInTheDocument()
  })

  it('add two Starter subscribers and verify MRR increases by $58', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Henry', 'Starter ($29/mo)')
    await addSub(u, 'Iris', 'Starter ($29/mo)')
    await nav(u, 'Dashboard')
    // original $108 + $29 + $29 = $166
    expect(screen.getByText('Monthly Recurring Revenue: $166')).toBeInTheDocument()
  })

  it('reset then add one Pro subscriber shows correct Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset subscribers/i }))
    await nav(u, 'Subscribers')
    await addSub(u, 'Zara', 'Pro ($79/mo)')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Monthly Recurring Revenue: $79')).toBeInTheDocument()
    expect(screen.getByText('Active rate: 100%')).toBeInTheDocument()
  })

  it('toggling all to inactive yields $0 MRR and 0% active rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle active for alice/i }))
    await u.click(screen.getByRole('button', { name: /toggle active for bob/i }))
    // Carol already inactive
    await nav(u, 'Dashboard')
    expect(screen.getByText('Monthly Recurring Revenue: $0')).toBeInTheDocument()
    expect(screen.getByText('Active rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 3')).toBeInTheDocument()
  })

  it('subscriber count heading updates after remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove alice/i }))
    await u.click(screen.getByRole('button', { name: /remove bob/i }))
    expect(screen.getByRole('heading', { name: /subscribers \(1\)/i })).toBeInTheDocument()
  })

  it('dashboard active rate rounds correctly for 2 of 3 active', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed is 2/3 active = 67%
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active rate: 67%')).toBeInTheDocument()
  })

  it('adding a subscriber then navigating away and back preserves them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Leo', 'Enterprise ($199/mo)')
    await nav(u, 'Settings')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Leo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /subscribers \(4\)/i })).toBeInTheDocument()
  })
})
