// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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
  it('leads heading shows 3 on initial load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
  })

  it('adding multiple leads increments count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Wayne Enterprises', '30000', 'demo')
    await addLead(u, 'Umbrella Corp', '15000', 'new')
    expect(screen.getByRole('heading', { name: 'Leads (5)' })).toBeInTheDocument()
  })

  it('pipeline total pipeline sums all leads including newly added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Weyland Corp', '7500', 'demo')
    await nav(u, 'Pipeline')
    // 5000 + 12000 + 8500 + 7500 = 33000
    expect(screen.getByText('Total pipeline: $33000.00')).toBeInTheDocument()
  })

  it('win rate is 100% when all leads are won', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete non-won seeded leads
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('filtering to a stage with no leads shows Leads (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete the one new lead
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: 'Leads (0)' })).toBeInTheDocument()
  })

  it('deleted lead does not appear in pipeline counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Demo: 0')).toBeInTheDocument()
    expect(screen.getByText('Total leads: 2')).toBeInTheDocument()
  })

  it('total pipeline is $0.00 and Total leads: 0 after deleting all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Acme Corp' }))
    await u.click(screen.getByRole('button', { name: 'Delete Globex' }))
    await u.click(screen.getByRole('button', { name: 'Delete Initech' }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total pipeline: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
  })

  it('pipeline new and demo counts update after adding leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Corp A', '1000', 'new')
    await addLead(u, 'Corp B', '2000', 'demo')
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
  })

  it('theme button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('leads list state persists after navigating to pipeline and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Persistent Co', '9999', 'won')
    await nav(u, 'Pipeline')
    await nav(u, 'Leads')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
    expect(screen.getByText('$9999.00')).toBeInTheDocument()
  })

  it('stage filter persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await nav(u, 'Settings')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: 'Leads (1)' })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('negative deal value is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Company'))
    await u.type(screen.getByLabelText('Company'), 'Bad Corp')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '-500')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: 'Leads (3)' })).toBeInTheDocument()
  })
})
