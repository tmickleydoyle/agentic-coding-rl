import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
  it('Showing count updates when a client is removed while filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    expect(screen.getByText('Showing: 2 clients')).toBeInTheDocument()
  })

  it('filter shows 0 clients when none match', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove the only active client
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: 'active', pressed: false }))
    expect(screen.getByText('Showing: 0 clients')).toBeInTheDocument()
  })

  it('adds multiple clients and Summary totals are correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Alpha', 'active', '1000')
    await addClient(u, 'Beta', 'active', '2000')
    await nav(u, 'Summary')
    // seeded active: 5000, new: 1000 + 2000
    expect(screen.getByText('Active value: $8000')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Total clients: 5')).toBeInTheDocument()
  })

  it('removing all clients gives zero totals in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0')).toBeInTheDocument()
  })

  it('churned client lifetime value included in Total value but not Active value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // Initech churned at 3200, should be in total but not active
    expect(screen.getByText('Total value: $8200')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5000')).toBeInTheDocument()
  })

  it('All filter button starts with aria-pressed true', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All', pressed: true })).toBeInTheDocument()
  })

  it('churned filter shows Initech and hides others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'churned', pressed: false }))
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary Leads count reflects added and removed leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Prospect A', 'lead', '500')
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    await nav(u, 'Summary')
    // started with 1 lead, added 1, removed 1 = still 1
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
  })

  it('client row displays status text', () => {
    render(<App />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    const acmeItem = items.find((li) => within(li).queryByText('Acme Corp'))
    expect(acmeItem).toBeTruthy()
    if (acmeItem) {
      expect(within(acmeItem).getByText('active')).toBeInTheDocument()
    }
  })
})
