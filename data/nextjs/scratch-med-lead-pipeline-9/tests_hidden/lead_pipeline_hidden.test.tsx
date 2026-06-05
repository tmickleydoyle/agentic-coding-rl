// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
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
  it('shows all three nav buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Leads' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pipeline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('filter by won shows only Initech from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('adds two new leads and pipeline total value is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Tyrell Corp', 'new', '6000')
    await addLead(u, 'Weyland', 'demo', '3000')
    await nav(u, 'Pipeline')
    // seed: 5000+12000+8000=25000 plus 6000+3000=9000 => 34000
    expect(screen.getByText('Total value: $34000')).toBeInTheDocument()
    expect(screen.getByText('Total leads: 5')).toBeInTheDocument()
  })

  it('deleting a won lead reduces Won count and Won value in pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Veridian', 'won', '7000')
    await u.click(screen.getByRole('button', { name: /delete veridian/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
    expect(screen.getByText('Won value: $8000')).toBeInTheDocument()
  })

  it('negative deal value is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Bad Corp', 'new', '-500')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('filtered view does not affect pipeline counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('adding a demo lead increments Demo count in pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Massive Dynamic', 'demo', '20000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $45000')).toBeInTheDocument()
  })

  it('Showing updates when filtering after adding a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Cyberdyne', 'new', '11000')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('leads list state persists after navigating to Pipeline and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Oscorp', 'won', '15000')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Oscorp')).toBeInTheDocument()
    expect(screen.getByText('$15000')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('pipeline Won value is 0 when no won leads exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won value: $0')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
  })
})
