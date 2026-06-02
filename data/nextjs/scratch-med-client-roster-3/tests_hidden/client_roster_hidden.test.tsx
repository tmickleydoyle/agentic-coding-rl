// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addClient(u: U, name: string, status: string, value: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.clear(screen.getByLabelText('Lifetime Value'))
  await u.type(screen.getByLabelText('Lifetime Value'), value)
  await u.click(screen.getByRole('button', { name: /add client/i }))
}

describe('Client Roster (held-out)', () => {
  it('heading count updates after adding a lead client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'NewCo', 'lead', '500')
    expect(screen.getByRole('heading', { name: 'Clients (4)' })).toBeInTheDocument()
  })

  it('filtered count shows 0 when no clients match', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove the only churned client first
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByRole('heading', { name: 'Clients (0)' })).toBeInTheDocument()
  })

  it('adds a churned client and it appears under churned filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'OldCo', 'churned', '100')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByText('OldCo')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Clients (2)' })).toBeInTheDocument()
  })

  it('Summary Leads count increases after adding a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'LeadCo', 'lead', '750')
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })

  it('Summary Active value excludes lead and churned clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Seed: active=5000, lead=1200, churned=800 => active value=5000
    await addClient(u, 'ActiveTwo', 'active', '2500')
    await nav(u, 'Summary')
    expect(screen.getByText('Active value: $7500.00')).toBeInTheDocument()
  })

  it('removing all clients shows Total clients: 0 in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await nav(u, 'Summary')
    await nav(u, 'Clients')
    // filter should still be active — only 1 shown
    expect(screen.getByRole('heading', { name: 'Clients (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
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

  it('negative lifetime value is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'BadValue')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '-100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByRole('heading', { name: 'Clients (3)' })).toBeInTheDocument()
    expect(screen.queryByText('BadValue')).not.toBeInTheDocument()
  })

  it('Summary total value includes newly added lead client', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Seed total: 5000 + 1200 + 800 = 7000
    await addClient(u, 'BigLead', 'lead', '3000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $10000.00')).toBeInTheDocument()
  })

  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Clients' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})
