// HELD-OUT generalization tests — fresh cross-view scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, value: string, stage: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), value)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline (held-out)', () => {
  it('seeded leads have correct stages displayed', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((i) => i.textContent ?? '')
    expect(texts.some((t) => t.includes('Acme Corp') && t.includes('new'))).toBe(true)
    expect(texts.some((t) => t.includes('Globex') && t.includes('demo'))).toBe(true)
    expect(texts.some((t) => t.includes('Initech') && t.includes('won'))).toBe(true)
  })

  it('adding a demo lead updates pipeline Demo count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'MomCorp', '4500', 'demo')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
  })

  it('adding multiple won leads accumulates Won value correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Alpha Inc', '2000', 'won')
    await addLead(u, 'Beta Ltd', '3000', 'won')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won: 3')).toBeInTheDocument()
    expect(screen.getByText('Won value: $13000')).toBeInTheDocument()
    expect(screen.getByText('Total value: $30000')).toBeInTheDocument()
  })

  it('deleting all leads shows zero totals in pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Demo: 0')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0')).toBeInTheDocument()
  })

  it('filtering by won then adding a new lead under filter does not show it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Hidden Co', '500', 'new')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.queryByText('Hidden Co')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
  })

  it('filter by demo shows only demo leads count heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'ExtraCo', '6000', 'demo')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByRole('heading', { name: /leads \(2\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
  })

  it('negative deal value is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'NegCo')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '-500')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
    expect(screen.queryByText('NegCo')).not.toBeInTheDocument()
  })

  it('pipeline new count reflects added new lead after navigation round-trip', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'RoundTrip', '1100', 'new')
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    await nav(u, 'Leads')
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })
})
