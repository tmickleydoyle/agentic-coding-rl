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
  it('starts on the Roster view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('shows seeded clients on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('formats seeded lifetime values correctly', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('shows Showing: 3 clients on load with All filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
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

  it('summary shows correct seeded stats', async () => {
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

  it('adds a new active client and it appears in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Umbrella Corp', 'active', '3000')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$3000.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 clients')).toBeInTheDocument()
  })

  it('ignores a client with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '500')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('ignores a client with zero lifetime value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Zero Corp')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '0')
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

  it('filters by Active status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
  })

  it('filters by Lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Lead' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters by Churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Churned' }))
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 clients')).toBeInTheDocument()
  })

  it('summary reflects newly added client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Cyberdyne', 'active', '2500')
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $9500.00')).toBeInTheDocument()
    expect(screen.getByText('Active value: $7500.00')).toBeInTheDocument()
  })

  it('summary reflects a removed client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $6200.00')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roster')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    await nav(u, 'Roster')
    expect(screen.getByText('Showing: 1 clients')).toBeInTheDocument()
  })

  it('adds a lead client and summary Leads count increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Wayne Enterprises', 'lead', '9999')
    await nav(u, 'Summary')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
  })
})
