// HELD-OUT generalization tests — fresh scenarios and cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence: 'High' | 'Medium' | 'Low' = 'High') {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('adding several stakeholders increments heading count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alpha', 'High')
    await addStakeholder(u, 'Beta', 'Medium')
    await addStakeholder(u, 'Gamma', 'Low')
    await addStakeholder(u, 'Delta', 'High')
    expect(screen.getByRole('heading', { name: /stakeholders \(4\)/i })).toBeInTheDocument()
  })

  it('filter Medium shows only medium stakeholders count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'A1', 'High')
    await addStakeholder(u, 'B1', 'Medium')
    await addStakeholder(u, 'C1', 'Medium')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'Medium')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('B1')).toBeInTheDocument()
    expect(screen.getByText('C1')).toBeInTheDocument()
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('toggling supportive on and off does not affect total in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Zara', 'High')
    await u.click(within(row('Zara')).getByRole('button', { name: /toggle supportive zara/i }))
    await u.click(within(row('Zara')).getByRole('button', { name: /toggle supportive zara/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/supportive: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/support rate: 0%/i)).toBeInTheDocument()
  })

  it('100% support rate when all stakeholders are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'X', 'High')
    await addStakeholder(u, 'Y', 'Medium')
    await u.click(within(row('X')).getByRole('button', { name: /toggle supportive x/i }))
    await u.click(within(row('Y')).getByRole('button', { name: /toggle supportive y/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/support rate: 100%/i)).toBeInTheDocument()
    expect(screen.getByText(/supportive: 2/i)).toBeInTheDocument()
  })

  it('removing the only supportive stakeholder resets support rate to 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Solo', 'Low')
    await u.click(within(row('Solo')).getByRole('button', { name: /toggle supportive solo/i }))
    await u.click(within(row('Solo')).getByRole('button', { name: /remove solo/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/supportive: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/support rate: 0%/i)).toBeInTheDocument()
  })

  it('filter does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'P1', 'High')
    await addStakeholder(u, 'P2', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/high: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/low: 1/i)).toBeInTheDocument()
  })

  it('theme toggle cycles light then dark then light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('supportive toggle state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Persist', 'Medium')
    await u.click(within(row('Persist')).getByRole('button', { name: /toggle supportive persist/i }))
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(within(row('Persist')).getByRole('button', { name: /toggle supportive persist/i })).toHaveTextContent('Supportive: Yes')
  })

  it('Low filter shows multiple Low stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Low1', 'Low')
    await addStakeholder(u, 'Low2', 'Low')
    await addStakeholder(u, 'High1', 'High')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'Low')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Low1')).toBeInTheDocument()
    expect(screen.getByText('Low2')).toBeInTheDocument()
  })
})
