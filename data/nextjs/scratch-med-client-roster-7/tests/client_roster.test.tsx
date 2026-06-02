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
    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
  })

  it('shows seeded clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded lifetime values formatted', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('shows correct initial visible count and total', () => {
    render(<App />)
    expect(screen.getByText('Visible: 3 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $7000.00')).toBeInTheDocument()
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

  it('shows correct initial summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Total Lifetime Value: $7000.00')).toBeInTheDocument()
    expect(screen.getByText('Active Value: $5000.00')).toBeInTheDocument()
  })

  it('adds a new client and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella', 'lead', '3000')
    expect(screen.getByText('Umbrella')).toBeInTheDocument()
    expect(screen.getByText('$3000.00')).toBeInTheDocument()
  })

  it('ignores a client with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '500')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Visible: 3 clients')).toBeInTheDocument()
  })

  it('ignores a client with zero lifetime value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Ghost')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '0')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.queryByText('Ghost')).not.toBeInTheDocument()
  })

  it('removes a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Globex' }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.getByText('Visible: 2 clients')).toBeInTheDocument()
  })

  it('filters by active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
    expect(screen.getByText('Visible: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $5000.00')).toBeInTheDocument()
  })

  it('filters by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lead')
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Visible: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $1200.00')).toBeInTheDocument()
  })

  it('filters by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Visible: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Visible Total: $800.00')).toBeInTheDocument()
  })

  it('resetting filter to all shows all clients again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Visible: 3 clients')).toBeInTheDocument()
  })

  it('adding a client updates summary stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Vandelay', 'active', '2500')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total Lifetime Value: $9500.00')).toBeInTheDocument()
    expect(screen.getByText('Active Value: $7500.00')).toBeInTheDocument()
  })

  it('removing a client updates summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Acme Corp' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Active Value: $0.00')).toBeInTheDocument()
  })

  it('toggles theme via settings', async () => {
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
    await nav(u, 'Clients')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('client list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Persisted Co', 'lead', '999')
    await nav(u, 'Summary')
    await nav(u, 'Clients')
    expect(screen.getByText('Persisted Co')).toBeInTheDocument()
  })

  it('filter state resets are independent of cross-view data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    expect(screen.getByText('Visible: 1 clients')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
  })
})
