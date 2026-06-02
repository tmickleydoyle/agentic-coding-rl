// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('shows all three seeded stages correctly labelled', () => {
    render(<App />)
    const stages = screen.getAllByText('new')
    expect(stages.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('demo').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('won').length).toBeGreaterThanOrEqual(1)
  })

  it('adding two new-stage leads updates pipeline New count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Alpha Inc', 'new', '500')
    await addLead(u, 'Beta LLC', 'new', '750')
    await nav(u, 'Pipeline')
    expect(screen.getByText('New: 3')).toBeInTheDocument()
  })

  it('adding a demo lead updates pipeline Demo count and total value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Cyberdyne', 'demo', '12000')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Demo: 2')).toBeInTheDocument()
    expect(screen.getByText('Total value: $16300.00')).toBeInTheDocument()
  })

  it('deleting the only won lead zeroes out Won value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won: 0')).toBeInTheDocument()
  })

  it('filter by demo then navigate away and back preserves filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    await nav(u, 'Settings')
    await nav(u, 'Leads')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('ignores a lead with negative deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Shadowy Corp', 'new', '-500')
    expect(screen.getByText('Showing: 3 leads')).toBeInTheDocument()
  })

  it('deleting all leads shows Showing: 0 leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    expect(screen.getByText('Showing: 0 leads')).toBeInTheDocument()
  })

  it('pipeline with no leads shows zeroes and zero values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 0')).toBeInTheDocument()
    expect(screen.getByText('Total value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Won value: $0.00')).toBeInTheDocument()
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

  it('filter does not affect pipeline totals even when only some visible', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByText('Showing: 1 leads')).toBeInTheDocument()
    await nav(u, 'Pipeline')
    expect(screen.getByText('Total leads: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Demo: 1')).toBeInTheDocument()
  })

  it('multiple won leads sum correctly in Won value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'MegaCorp', 'won', '4200')
    await nav(u, 'Pipeline')
    expect(screen.getByText('Won value: $5000.00')).toBeInTheDocument()
    expect(screen.getByText('Won: 2')).toBeInTheDocument()
  })
})
