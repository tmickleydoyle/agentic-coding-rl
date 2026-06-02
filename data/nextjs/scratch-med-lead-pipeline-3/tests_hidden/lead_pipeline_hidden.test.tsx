// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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
  it('adding two more won leads updates win rate to 60%', async () => {
    const u = userEvent.setup()
    render(<App />)
    // start: 3 leads, 1 won => 33%
    await addLead(u, 'Corp A', '1000', 'won')
    await addLead(u, 'Corp B', '2000', 'won')
    // now 5 leads, 3 won => 60%
    await nav(u, 'Summary')
    expect(screen.getByText(/total leads: 5/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 60%/i)).toBeInTheDocument()
  })

  it('pipeline total includes all stages after additions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'NewCo', '3000', 'new')
    // seed total 25000 + 3000 = 28000
    await nav(u, 'Summary')
    expect(screen.getByText(/pipeline total: \$28000/i)).toBeInTheDocument()
  })

  it('filtering by demo then adding a new lead in demo increases count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await addLead(u, 'DemoKing', '9000', 'demo')
    expect(screen.getByRole('heading', { name: /showing 2 leads/i })).toBeInTheDocument()
    expect(screen.getByText('DemoKing')).toBeInTheDocument()
  })

  it('Summary new count updates when new lead added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Freshy', '500', 'new')
    await nav(u, 'Summary')
    expect(screen.getByText(/^New: 2$/i)).toBeInTheDocument()
  })

  it('deleting all leads makes pipeline total $0 and win rate 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total leads: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline total: \$0/i)).toBeInTheDocument()
    expect(screen.getByText(/won total: \$0/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 0%/i)).toBeInTheDocument()
  })

  it('filter set to won shows only won leads after adding a won lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Winner Inc', '50000', 'won')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.getByText('Winner Inc')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /showing 2 leads/i })).toBeInTheDocument()
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

  it('leads list is preserved after navigating to Summary and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Persist Co', '4000', 'new')
    await nav(u, 'Summary')
    await nav(u, 'Leads')
    expect(screen.getByText('Persist Co')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /showing 4 leads/i })).toBeInTheDocument()
  })
})
