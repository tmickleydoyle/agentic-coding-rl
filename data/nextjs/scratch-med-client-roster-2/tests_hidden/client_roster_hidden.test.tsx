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

describe('Client Roster (held-out)', () => {
  it('total for all=all with seeded data is $7000', () => {
    render(<App />)
    expect(screen.getByText('Total: $7000')).toBeInTheDocument()
  })

  it('adds two churned clients and filter shows combined total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Gone Inc', 'churned', '600')
    await addClient(u, 'Bye Co', 'churned', '900')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'churned')
    // seeded Old Partner $800 + Gone Inc $600 + Bye Co $900 = $2300
    expect(screen.getByText('Total: $2300')).toBeInTheDocument()
    expect(screen.getByText('Old Partner')).toBeInTheDocument()
    expect(screen.getByText('Gone Inc')).toBeInTheDocument()
    expect(screen.getByText('Bye Co')).toBeInTheDocument()
  })

  it('removing a filtered client updates the filtered total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'active')
    await u.click(screen.getByRole('button', { name: /remove acme corp/i }))
    expect(screen.getByText('Total: $0')).toBeInTheDocument()
  })

  it('switching filter back to all after removing a client shows updated total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bright ideas/i }))
    // remaining: Acme $5000 + Old Partner $800 = $5800
    expect(screen.getByText('Total: $5800')).toBeInTheDocument()
  })

  it('Stats Active value updates after adding an active client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addClient(u, 'Hot Lead', 'active', '1000')
    await nav(u, 'Stats')
    // Acme $5000 + Hot Lead $1000 = $6000
    expect(screen.getByText('Active value: $6000')).toBeInTheDocument()
  })

  it('Stats Total value correct after removing seeded client', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bright ideas/i }))
    await u.click(screen.getByRole('button', { name: /remove old partner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total clients: 1')).toBeInTheDocument()
    expect(screen.getByText('Total value: $5000')).toBeInTheDocument()
    expect(screen.getByText('Leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Churned: 0')).toBeInTheDocument()
  })

  it('negative lifetime value is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Bad Entry')
    await u.clear(screen.getByLabelText('Lifetime Value'))
    await u.type(screen.getByLabelText('Lifetime Value'), '-100')
    await u.click(screen.getByRole('button', { name: /add client/i }))
    expect(screen.queryByText('Bad Entry')).not.toBeInTheDocument()
    expect(screen.getByText('Total: $7000')).toBeInTheDocument()
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

  it('filter by lead then add a lead shows it in filtered view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'lead')
    await addClient(u, 'New Lead', 'lead', '750')
    expect(screen.getByText('New Lead')).toBeInTheDocument()
    // Bright Ideas $1200 + New Lead $750 = $1950
    expect(screen.getByText('Total: $1950')).toBeInTheDocument()
  })

  it('seeded client statuses are displayed correctly', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    const acme = texts.find((t) => t.includes('Acme Corp'))
    const bright = texts.find((t) => t.includes('Bright Ideas'))
    const old = texts.find((t) => t.includes('Old Partner'))
    expect(acme).toContain('active')
    expect(bright).toContain('lead')
    expect(old).toContain('churned')
  })
})
