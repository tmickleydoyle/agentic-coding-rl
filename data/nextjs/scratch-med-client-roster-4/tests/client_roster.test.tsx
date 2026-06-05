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

  it('shows three seeded clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('shows seeded client values formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$4200.00')).toBeInTheDocument()
    expect(screen.getByText('$850.00')).toBeInTheDocument()
    expect(screen.getByText('$3100.00')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows seeded stats on the Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $8150.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $4200.00')).toBeInTheDocument()
  })

  it('adds a new client and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella', 'lead', '5000')
    expect(screen.getByText('Umbrella')).toBeInTheDocument()
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/lifetime value/i))
    await u.type(screen.getByLabelText(/lifetime value/i), '100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('ignores a non-positive lifetime value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/client name/i), 'Ghost')
    await u.clear(screen.getByLabelText(/lifetime value/i))
    await u.type(screen.getByLabelText(/lifetime value/i), '0')
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
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('filters by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'lead')
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('filters by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('stats reflect all clients regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'active')
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $8150.00')).toBeInTheDocument()
  })

  it('adding a client updates the Stats view (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Initrode', 'active', '2000')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $10150.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $6200.00')).toBeInTheDocument()
  })

  it('removing a client updates the Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $3950.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $0.00')).toBeInTheDocument()
  })

  it('toggles the theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'lead')
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('resetting filter to all shows all clients again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'churned')
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })
})
