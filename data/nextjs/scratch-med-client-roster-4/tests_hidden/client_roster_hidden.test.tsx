// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClient(u: U, name: string, status: string, value: string) {
  await u.clear(screen.getByLabelText(/client name/i))
  await u.type(screen.getByLabelText(/client name/i), name)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.clear(screen.getByLabelText(/lifetime value/i))
  await u.type(screen.getByLabelText(/lifetime value/i), value)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster (held-out)', () => {
  it('seeded total value sums all three clients correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // 4200 + 850 + 3100 = 8150
    expect(screen.getByText('Total value: $8150.00')).toBeInTheDocument()
  })

  it('adding a churned client updates churned count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'OldCo', 'churned', '999')
    await nav(u, 'Stats')
    expect(screen.getByText('Churned: 2')).toBeInTheDocument()
  })

  it('adding a lead client updates leads count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'ProspectX', 'lead', '300')
    await nav(u, 'Stats')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('active value stays 0 when no active clients remain', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('decimal lifetime value is formatted to two decimal places', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Penny Co', 'active', '99.9')
    expect(screen.getByText('$99.90')).toBeInTheDocument()
  })

  it('filtering by churned hides active and lead clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('removing all clients leaves empty Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('removing all clients shows Showing: 0 clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    expect(screen.getByText('Showing: 0 clients')).toBeInTheDocument()
  })

  it('theme toggle switches back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('new client added while filtered is visible after resetting filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    await addClient(u, 'NewLead', 'lead', '1500')
    // lead should not be visible while filtered to active
    expect(screen.queryByText('NewLead')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('NewLead')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })

  it('Stats active value includes newly added active client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'BigCo', 'active', '10000')
    await nav(u, 'Stats')
    // 4200 + 10000 = 14200
    expect(screen.getByText('Active value: $14200.00')).toBeInTheDocument()
  })
})
