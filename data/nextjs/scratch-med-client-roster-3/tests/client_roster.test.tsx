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

describe('Client Roster app', () => {
  it('starts on the Clients view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /clients/i })).toBeInTheDocument()
  })

  it('seeds three clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded clients heading count as Clients (3)', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Clients (3)' })).toBeInTheDocument()
  })

  it('displays lifetime value formatted with dollar sign and two decimals', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new active client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella Corp', 'active', '9000')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$9000.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Clients (4)' })).toBeInTheDocument()
  })

  it('ignores a client with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '500')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByRole('heading', { name: 'Clients (3)' })).toBeInTheDocument()
  })

  it('ignores a client with a zero lifetime value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Ghost')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '0')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByRole('heading', { name: 'Clients (3)' })).toBeInTheDocument()
  })

  it('removes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Clients (2)' })).toBeInTheDocument()
  })

  it('filters by active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    expect(screen.getByRole('heading', { name: 'Clients (1)' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lead')
    expect(screen.getByRole('heading', { name: 'Clients (1)' })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByRole('heading', { name: 'Clients (1)' })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('resets to all when filter set back to all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Clients (3)' })).toBeInTheDocument()
  })

  it('Summary shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $7000.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5000.00')).toBeInTheDocument()
  })

  it('Summary updates after adding a client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Veridian', 'active', '3000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $10000.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $8000.00')).toBeInTheDocument()
  })

  it('Summary reflects removal of a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $6200.00')).toBeInTheDocument()
  })

  it('filter does not affect Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
  })

  it('toggles theme to dark in Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Clients')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves client list state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Persistent Co', 'lead', '250')
    await nav(u, 'Summary')
    await nav(u, 'Clients')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
  })
})
