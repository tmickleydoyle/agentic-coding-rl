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

describe('Client Roster app', () => {
  it('starts on the Roster view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('seeds three clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded clients with correct formatted values', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$3200')).toBeInTheDocument()
  })

  it('shows Showing: 3 clients by default', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Roster')
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('adds a new active client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella Inc', 'active', '8000')
    expect(screen.getByText('Umbrella Inc')).toBeInTheDocument()
    expect(screen.getByText('$8000')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })

  it('ignores blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/client name/i))
    await u.clear(screen.getByLabelText(/lifetime value/i))
    await u.type(screen.getByLabelText(/lifetime value/i), '100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('removes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 clients')).toBeInTheDocument()
  })

  it('filters by active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'active', pressed: false }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'lead', pressed: false }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('filters by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'churned', pressed: false }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('All filter button restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'active', pressed: false }))
    await u.click(screen.getByRole('button', { name: 'All', pressed: false }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'lead', pressed: false }))
    expect(screen.getByRole('button', { name: 'lead', pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All', pressed: false })).toBeInTheDocument()
  })

  it('Summary shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $8200')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5000')).toBeInTheDocument()
  })

  it('Summary updates after adding a client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Wernham Hogg', 'active', '2000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $10200')).toBeInTheDocument()
    expect(screen.getByText('Active value: $7000')).toBeInTheDocument()
  })

  it('Summary updates after removing a client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $5000')).toBeInTheDocument()
  })

  it('Summary reflects filter-agnostic totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'active', pressed: false }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves roster state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Persistent Co', 'lead', '999')
    await nav(u, 'Summary')
    await nav(u, 'Roster')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
  })

  it('adds a lead client and it appears in Summary Leads count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'New Lead LLC', 'lead', '1500')
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })
})
