// HELD-OUT generalization tests — fresh inputs, edge cases, cross-view sequences.
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
  it('displays seed lead stages', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const stages = items.map((li) => li.textContent)
    const hasNew = stages.some((t) => t && t.includes('new'))
    const hasDemo = stages.some((t) => t && t.includes('demo'))
    const hasWon = stages.some((t) => t && t.includes('won'))
    expect(hasNew).toBe(true)
    expect(hasDemo).toBe(true)
    expect(hasWon).toBe(true)
  })

  it('adds two new leads and count becomes 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Alpha Ltd', 'new', '1000')
    await addLead(u, 'Beta LLC', 'demo', '2000')
    expect(screen.getByRole('heading', { name: 'All Leads (5)' })).toBeInTheDocument()
  })

  it('Demo filter shows 0 when all demo leads are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Demo' }))
    expect(screen.getByRole('heading', { name: 'Demo Leads (0)' })).toBeInTheDocument()
  })

  it('adding a won lead increases Won Pipeline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Cyberdyne', 'won', '15000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won Pipeline: $18200')).toBeInTheDocument()
  })

  it('total pipeline sums all stages including new and demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Tyrell Corp', 'new', '7300')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Pipeline: $31000')).toBeInTheDocument()
  })

  it('win rate rounds to nearest whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete seed data
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    // 2 won out of 3 = 67%
    await addLead(u, 'X', 'won', '1000')
    await addLead(u, 'Y', 'won', '1000')
    await addLead(u, 'Z', 'new', '1000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win Rate: 67%')).toBeInTheDocument()
  })

  it('Pipeline New/Demo/Won counts update after deletions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
    expect(screen.getByText('Won: 1')).toBeInTheDocument()
  })

  it('filter resets count correctly after adding a lead matching the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Won' }))
    expect(screen.getByRole('heading', { name: 'Won Leads (1)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    await addLead(u, 'Weyland', 'won', '99000')
    await u.click(screen.getByRole('button', { name: 'Won' }))
    expect(screen.getByRole('heading', { name: 'Won Leads (2)' })).toBeInTheDocument()
    expect(screen.getByText('Weyland')).toBeInTheDocument()
    expect(screen.getByText('$99000')).toBeInTheDocument()
  })

  it('toggling theme back to light restores data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('deleting all leads shows Total Leads: 0 and Total Pipeline: $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total Leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total Pipeline: $0')).toBeInTheDocument()
    expect(screen.getByText('Won Pipeline: $0')).toBeInTheDocument()
    expect(screen.getByText('Win Rate: 0%')).toBeInTheDocument()
  })

  it('lead form clears after successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'CleanForm Co', 'new', '5000')
    expect(screen.getByLabelText('Company')).toHaveValue('')
  })
})
