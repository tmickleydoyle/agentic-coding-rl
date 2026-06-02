// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExp(u: U, name: string) {
  await u.clear(screen.getByLabelText(/experiment name/i))
  await u.type(screen.getByLabelText(/experiment name/i), name)
  await u.click(screen.getByRole('button', { name: /add experiment/i }))
}

function expRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Experiment Log (held-out)', () => {
  it('heading count is 0 initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('heading count increments per added experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp A')
    await addExp(u, 'Exp B')
    await addExp(u, 'Exp C')
    expect(screen.getByRole('heading', { name: /experiments \(3\)/i })).toBeInTheDocument()
  })

  it('two experiments — one A winner one B winner — both tracked in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'First')
    await addExp(u, 'Second')
    await u.click(within(expRow('First')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('First')).getByRole('button', { name: /winner a/i }))
    await u.click(within(expRow('Second')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Second')).getByRole('button', { name: /winner b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/winner a: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/winner b: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/finished: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 100%/i)).toBeInTheDocument()
  })

  it('win rate rounds to 33% for one-of-three finished', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P')
    await addExp(u, 'Q')
    await addExp(u, 'R')
    await u.click(within(expRow('P')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P')).getByRole('button', { name: /winner a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/win rate: 33%/i)).toBeInTheDocument()
  })

  it('Show running only filter with all running shows full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Run1')
    await addExp(u, 'Run2')
    await u.click(screen.getByLabelText(/show running only/i))
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('filter persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Keep')
    await addExp(u, 'Hide')
    await u.click(within(expRow('Hide')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Hide')).getByRole('button', { name: /winner b/i }))
    await u.click(screen.getByLabelText(/show running only/i))
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.queryByText('Hide')).not.toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('toggle theme button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Winner A and Winner B buttons disappear after selection', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Disappear test')
    await u.click(within(expRow('Disappear test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Disappear test')).getByRole('button', { name: /winner b/i }))
    expect(screen.queryByRole('button', { name: /winner a/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /winner b/i })).not.toBeInTheDocument()
  })

  it('multiple experiments can be independently completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Indep1')
    await addExp(u, 'Indep2')
    await u.click(within(expRow('Indep1')).getByRole('button', { name: /mark done/i }))
    // Indep2 still shows mark done, not winner buttons
    expect(within(expRow('Indep2')).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
    expect(within(expRow('Indep2')).queryByRole('button', { name: /winner a/i })).not.toBeInTheDocument()
  })

  it('Stats Total updates after each new experiment added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 0/i)).toBeInTheDocument()
    await nav(u, 'Experiments')
    await addExp(u, 'NewOne')
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 1/i)).toBeInTheDocument()
  })
})
