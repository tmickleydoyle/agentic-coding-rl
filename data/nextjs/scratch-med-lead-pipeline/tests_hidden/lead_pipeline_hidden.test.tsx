// HELD-OUT generalization tests — fresh scenarios, different inputs and sequences.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('adds multiple leads and count grows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Wayne Enterprises', 'new', '50000')
    await addLead(u, 'Stark Industries', 'demo', '75000')
    expect(screen.getByRole('heading', { name: /leads \(5\)/i })).toBeInTheDocument()
  })

  it('new lead appears with correct dollar format', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Cyberdyne', 'won', '99000')
    expect(screen.getByText('$99000')).toBeInTheDocument()
  })

  it('filter by demo shows only demo leads including newly added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Soylent Corp', 'demo', '3000')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Soylent Corp')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /leads \(2\)/i })).toBeInTheDocument()
  })

  it('deleting all won leads makes won pipeline $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won pipeline: $0')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
  })

  it('pipeline total is sum of all stages', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'PaperStreet', 'new', '4500')
    await nav(u, 'Pipeline')
    // 5000 + 12000 + 8500 + 4500 = 30000
    expect(screen.getByText('Total pipeline: $30000')).toBeInTheDocument()
  })

  it('pipeline reflects correct new count after adding two new-stage leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Vandelay', 'new', '7000')
    await addLead(u, 'Bluth Company', 'new', '3000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 3')).toBeInTheDocument()
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

  it('ignores lead with negative deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Sketchy LLC')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '-500')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('leads count heading updates live with filter changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByRole('heading', { name: /leads \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })

  it('after deleting, adding a new lead brings count back up', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    expect(screen.getByRole('heading', { name: /leads \(2\)/i })).toBeInTheDocument()
    await addLead(u, 'Replacement Inc', 'new', '1000')
    expect(screen.getByRole('heading', { name: /leads \(3\)/i })).toBeInTheDocument()
  })
})
