// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (influence) {
    await u.selectOptions(screen.getByLabelText('Influence'), influence)
  }
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('adding multiple stakeholders updates heading count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Anna', 'high')
    await addStakeholder(u, 'Boris', 'med')
    await addStakeholder(u, 'Cleo', 'low')
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
  })

  it('removing one of multiple stakeholders reduces count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dana', 'high')
    await addStakeholder(u, 'Eli', 'low')
    await u.click(screen.getByRole('button', { name: /remove dana/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Dana')).not.toBeInTheDocument()
    expect(screen.getByText('Eli')).toBeInTheDocument()
  })

  it('filter med shows only med stakeholders and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Faye', 'med')
    await addStakeholder(u, 'Greg', 'high')
    await addStakeholder(u, 'Hana', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByText('Faye')).toBeInTheDocument()
    expect(screen.getByText('Hana')).toBeInTheDocument()
    expect(screen.queryByText('Greg')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('filter low shows zero when none are low', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivan', 'high')
    await addStakeholder(u, 'Jade', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('toggling supportive twice returns to not supportive in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Kai', 'high')
    await u.click(within(row('Kai')).getByRole('button', { name: /not supportive/i }))
    await u.click(within(row('Kai')).getByRole('button', { name: /^supportive$/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('summary high/med/low counts add up to total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Lena', 'high')
    await addStakeholder(u, 'Mo', 'high')
    await addStakeholder(u, 'Nina', 'med')
    await addStakeholder(u, 'Omar', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('High influence: 2')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 1')).toBeInTheDocument()
  })

  it('support rate is 100% when all are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Pia', 'high')
    await addStakeholder(u, 'Quin', 'med')
    await u.click(within(row('Pia')).getByRole('button', { name: /not supportive/i }))
    await u.click(within(row('Quin')).getByRole('button', { name: /not supportive/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('theme persists after toggling and navigating back to stakeholders', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stakeholders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('removing a supportive stakeholder updates summary support rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rosa', 'high')
    await addStakeholder(u, 'Seth', 'low')
    await u.click(within(row('Rosa')).getByRole('button', { name: /not supportive/i }))
    await u.click(screen.getByRole('button', { name: /remove rosa/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('filter state does not affect summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tara', 'high')
    await addStakeholder(u, 'Uma', 'low')
    await addStakeholder(u, 'Vera', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 2')).toBeInTheDocument()
  })
})
