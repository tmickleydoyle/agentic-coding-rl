// HELD-OUT generalization tests — fresh inputs, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, stage: string, dealValue: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), dealValue)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline (held-out)', () => {
  it('seeded leads show correct stages', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((i) => i.textContent)
    const hasNew = texts.some((t) => t && t.includes('new') && t.includes('Acme Corp'))
    const hasDemo = texts.some((t) => t && t.includes('demo') && t.includes('Beta LLC'))
    const hasWon = texts.some((t) => t && t.includes('won') && t.includes('Gamma Inc'))
    expect(hasNew).toBe(true)
    expect(hasDemo).toBe(true)
    expect(hasWon).toBe(true)
  })

  it('adding two new-stage leads updates Summary New count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Corp A', 'new', '3000')
    await addLead(u, 'Corp B', 'new', '4000')
    await nav(u, 'Summary')
    expect(screen.getByText('New: 3')).toBeInTheDocument()
  })

  it('adding a demo lead increases Total pipeline correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Zeta Co', 'demo', '3000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total pipeline: $28000')).toBeInTheDocument()
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
  })

  it('deleting the only won lead makes Won value $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Gamma Inc' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0')).toBeInTheDocument()
  })

  it('filter by demo then add a demo lead increments visible count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    await addLead(u, 'Omega Ltd', 'demo', '6000')
    expect(screen.getByText('Showing: 2 leads')).toBeInTheDocument()
  })

  it('filter by new does not show won leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.queryByText('Gamma Inc')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta LLC')).not.toBeInTheDocument()
  })

  it('deleting all leads shows Showing: 0 leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Beta LLC' }))
    await u.click(screen.getByRole('button', { name: 'Delete Gamma Inc' }))
    expect(screen.getByText('Showing: 0 leads')).toBeInTheDocument()
  })

  it('Summary shows Total leads: 0 and Total pipeline: $0 after deleting all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Beta LLC' }))
    await u.click(screen.getByRole('button', { name: 'Delete Gamma Inc' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $0')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('ignores a negative deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Bad Co')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '-500')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('leads list state persists when switching to Summary and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Persist Co', 'new', '1000')
    await nav(u, 'Summary')
    await nav(u, 'Leads')
    expect(screen.getByText('Persist Co')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 leads')).toBeInTheDocument()
  })
})
