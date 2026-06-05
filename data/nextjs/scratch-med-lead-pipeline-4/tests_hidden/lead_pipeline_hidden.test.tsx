// HELD-OUT generalization tests — fresh scenarios and edge cases.
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

describe('Lead Pipeline (held-out)', () => {
  it('seeded data totals correctly on Dashboard at startup', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pipeline Total: $25500.00')).toBeInTheDocument()
    expect(screen.getByText('Won Total: $8500.00')).toBeInTheDocument()
  })

  it('filtering by new shows only new leads and correct filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Filtered Total: $5000.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('filtering by demo shows correct filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Filtered Total: $12000.00')).toBeInTheDocument()
  })

  it('add multiple leads and Dashboard counts them all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Alpha Inc', 'new', '3000')
    await addLead(u, 'Beta LLC', 'won', '7000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total Leads: 5')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
  })

  it('win rate rounds correctly with two won out of five', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Delta Co', 'won', '1000')
    await addLead(u, 'Epsilon', 'new', '500')
    // Now 2 won out of 5 total => 40%
    await nav(u, 'Dashboard')
    expect(screen.getByText('Win Rate: 40%')).toBeInTheDocument()
  })

  it('deleting all leads shows Pipeline Total: $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pipeline Total: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won Total: $0.00')).toBeInTheDocument()
  })

  it('filter resets to all shows all 3 seeded leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
    expect(screen.getByText('Filtered Total: $25500.00')).toBeInTheDocument()
  })

  it('newly added won lead appears in Dashboard Won Total immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Stark Industries', 'won', '50000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Won Total: $58500.00')).toBeInTheDocument()
  })

  it('Dashboard Demo count updates after adding demo lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Wayne Enterprises', 'demo', '9000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
  })

  it('theme toggle goes back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('leads view state (added lead) persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Monsters Inc', 'new', '4500')
    await nav(u, 'Dashboard')
    await nav(u, 'Leads')
    expect(screen.getByText('Monsters Inc')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 leads')).toBeInTheDocument()
  })

  it('filter by won with added won lead shows updated filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Vandelay Industries', 'won', '6000')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByText('Filtered Total: $14500.00')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
  })
})
