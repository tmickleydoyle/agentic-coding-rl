// HELD-OUT generalization tests — not seen by the agent during generation.
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
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('A/B Experiment Log (held-out)', () => {
  it('heading count updates as experiments are added one by one', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
    await addExp(u, 'Alpha')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    await addExp(u, 'Beta')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('Done filter count matches resolved experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'X1')
    await addExp(u, 'X2')
    await addExp(u, 'X3')
    await u.click(within(expRow('X1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('X1')).getByRole('button', { name: /winner: b/i }))
    await u.click(within(expRow('X3')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('X3')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('deleting a done experiment updates Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Remove me')
    await addExp(u, 'Keep me')
    await u.click(within(expRow('Remove me')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Remove me')).getByRole('button', { name: /winner: a/i }))
    await u.click(within(expRow('Remove me')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('A wins: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('Running filter count decreases after resolving an experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P')
    await addExp(u, 'Q')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    await u.click(within(expRow('P')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P')).getByRole('button', { name: /winner: b/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('Stats Running count decreases after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Temp')
    await addExp(u, 'Stay')
    await u.click(within(expRow('Temp')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
  })

  it('winner label shows correctly for B winner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Sidebar test')
    await u.click(within(expRow('Sidebar test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Sidebar test')).getByRole('button', { name: /winner: b/i }))
    expect(within(expRow('Sidebar test')).getByText('Winner: B')).toBeInTheDocument()
  })

  it('filter state persists after navigating away and returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persistent filter exp')
    await u.click(within(expRow('Persistent filter exp')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Persistent filter exp')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    // filter stays as Running, done exp not visible
    expect(screen.queryByText('Persistent filter exp')).not.toBeInTheDocument()
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

  it('multiple B wins reflected in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'G1')
    await addExp(u, 'G2')
    await u.click(within(expRow('G1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('G1')).getByRole('button', { name: /winner: b/i }))
    await u.click(within(expRow('G2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('G2')).getByRole('button', { name: /winner: b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('B wins: 2')).toBeInTheDocument()
    expect(screen.getByText('A wins: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })
})
