import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, stage: string, value: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), value)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline app', () => {
  it('starts on the Leads view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('shows seeded leads on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows seeded deal values formatted with two decimal places', () => {
    render(<App />)
    expect(screen.getByText('$5000.00')).toBeInTheDocument()
    expect(screen.getByText('$12000.00')).toBeInTheDocument()
    expect(screen.getByText('$8500.00')).toBeInTheDocument()
  })

  it('shows Showing: 3 leads for seeded data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('shows correct Filtered Total for all seeded leads', () => {
    render(<App />)
    expect(screen.getByText('Filtered Total: $25500.00')).toBeInTheDocument()
  })

  it('navigates to Dashboard and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new lead and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Corp', 'demo', '20000')
    expect(screen.getByText('Umbrella Corp')).toBeInTheDocument()
    expect(screen.getByText('$20000.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 leads')).toBeInTheDocument()
  })

  it('ignores a lead with blank company', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Company'))
    await u.type(screen.getByLabelText('Company'), 'Ghost Co')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('deletes a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
  })

  it('filters by stage and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('filters by demo stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filtered total updates when filtering by won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByText('Filtered Total: $8500.00')).toBeInTheDocument()
  })

  it('Dashboard shows correct total leads from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Leads: 3')).toBeInTheDocument()
  })

  it('Dashboard shows per-stage counts from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
  })

  it('Dashboard shows Pipeline Total for all seeded leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pipeline Total: $25500.00')).toBeInTheDocument()
  })

  it('Dashboard shows Won Total for seeded won lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won Total: $8500.00')).toBeInTheDocument()
  })

  it('Dashboard shows Win Rate as whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win Rate: 33%')).toBeInTheDocument()
  })

  it('adding a lead updates Dashboard total (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Cyberdyne', 'won', '15000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Leads: 4')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
    expect(screen.getByText('Won Total: $23500.00')).toBeInTheDocument()
    expect(screen.getByText('Pipeline Total: $40500.00')).toBeInTheDocument()
  })

  it('deleting a lead updates Dashboard (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Leads: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Win Rate: 0%')).toBeInTheDocument()
  })

  it('Dashboard Win Rate is 0% when no leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win Rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total Leads: 0')).toBeInTheDocument()
  })

  it('theme toggles via Settings and persists', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Dashboard')
    await nav(u, 'Leads')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $8500.00')).toBeInTheDocument()
  })
})
