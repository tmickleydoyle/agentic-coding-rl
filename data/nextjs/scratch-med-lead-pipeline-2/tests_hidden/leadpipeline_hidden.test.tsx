// HELD-OUT generalization tests — fresh scenarios and edge cases.
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
  it('seed leads show correct stages', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    expect(texts.some((t) => t.includes('new') && t.includes('Acme Corp'))).toBe(true)
    expect(texts.some((t) => t.includes('demo') && t.includes('Globex'))).toBe(true)
    expect(texts.some((t) => t.includes('won') && t.includes('Initech'))).toBe(true)
  })

  it('adding multiple leads increases showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Alpha Inc', '5000', 'new')
    await addLead(u, 'Beta LLC', '7000', 'demo')
    expect(screen.getByText('Showing: 5 leads')).toBeInTheDocument()
  })

  it('filter by demo shows correct count after adding a demo lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'NewDemoCompany', '3000', 'demo')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
    expect(screen.getByText('NewDemoCompany')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('Pipeline Demo count updates after adding a demo lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'DemoCo', '9000', 'demo')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
    expect(screen.getByText('Total leads: 4')).toBeInTheDocument()
  })

  it('Pipeline total pipeline value sums correctly after adding leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Tyrell', '1500', 'new')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total pipeline: $44000')).toBeInTheDocument()
  })

  it('deleting all won leads sets Win rate to 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
  })

  it('adding two won leads gives 50% win rate with original two remaining non-won leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Start: 3 leads, 1 won. Delete existing won, add 2 new won out of 4 total
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    // Now: 2 leads (Acme new, Globex demo)
    await addLead(u, 'WonCo1', '5000', 'won')
    await addLead(u, 'WonCo2', '5000', 'won')
    // Now: 4 leads, 2 won => 50%
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win rate: 50%')).toBeInTheDocument()
  })

  it('negative deal value is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Bad Deal')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '-500')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
    expect(screen.queryByText('Bad Deal')).not.toBeInTheDocument()
  })

  it('filter state persists when navigating to Pipeline and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
  })

  it('Pipeline New count updates after deleting a new lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
    expect(screen.getByRole('button', { name: 'Toggle theme (current: light)' })).toBeInTheDocument()
  })
})
