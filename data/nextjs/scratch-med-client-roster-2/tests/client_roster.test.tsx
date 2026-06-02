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
  it('starts on the Roster view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Bright Ideas')).toBeInTheDocument()
    expect(screen.getByText('Old Partner')).toBeInTheDocument()
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

  it('navigates back to Roster from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })

  it('shows seeded lifetime values formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$1200')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
  })

  it('shows correct total for all seeded clients', () => {
    render(<App />)
    expect(screen.getByText('Total: $7000')).toBeInTheDocument()
  })

  it('adds a new active client and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'New Biz', 'active', '3000')
    expect(screen.getByText('New Biz')).toBeInTheDocument()
    expect(screen.getByText('$3000')).toBeInTheDocument()
  })

  it('ignores a client with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '500')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.getByText('Total: $7000')).toBeInTheDocument()
  })

  it('ignores a client with zero lifetime value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Ghost Client')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '0')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.queryByText('Ghost Client')).not.toBeInTheDocument()
  })

  it('removes a client by clicking Remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('updates total after removing a client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    expect(screen.getByText('Total: $2000')).toBeInTheDocument()
  })

  it('filters by active status and shows correct total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Bright Ideas')).not.toBeInTheDocument()
    expect(screen.queryByText('Old Partner')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $5000')).toBeInTheDocument()
  })

  it('filters by lead status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lead')
    expect(screen.getByText('Bright Ideas')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $1200')).toBeInTheDocument()
  })

  it('filters by churned status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    expect(screen.getByText('Old Partner')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $800')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await nav(u, 'Stats')
    await nav(u, 'Roster')
    expect((screen.getByLabelText('Filter by status') as HTMLSelectElement).value).toBe('active')
    expect(screen.queryByText('Old Partner')).not.toBeInTheDocument()
  })

  it('Stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Leads: 1')).toBeInTheDocument()
    expect(screen.getByText('Churned: 1')).toBeInTheDocument()
    expect(screen.getByText('Active value: $5000')).toBeInTheDocument()
    expect(screen.getByText('Total value: $7000')).toBeInTheDocument()
  })

  it('Stats reflect a newly added client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Growth Co', 'active', '2500')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Active value: $7500')).toBeInTheDocument()
    expect(screen.getByText('Total value: $9500')).toBeInTheDocument()
  })

  it('Stats reflect a removed client (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove old partner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 2')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $6200')).toBeInTheDocument()
  })

  it('Stats ignore the roster filter — show all clients', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 3')).toBeInTheDocument()
    expect(screen.getByText('Total value: $7000')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roster')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('adds a lead client and Stats Leads count increments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Prospect LLC', 'lead', '400')
    await nav(u, 'Stats')
    expect(screen.getByText('Leads: 2')).toBeInTheDocument()
  })
})
