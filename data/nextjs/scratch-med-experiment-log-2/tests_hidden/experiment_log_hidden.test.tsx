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

describe('Experiment Log (held-out)', () => {
  it('multiple experiments can each be individually completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Font test')
    await addExp(u, 'Color test')
    await u.click(within(expRow('Font test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Font test')).getByRole('button', { name: /winner: b/i }))
    await u.click(within(expRow('Color test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Color test')).getByRole('button', { name: /winner: a/i }))
    expect(within(expRow('Font test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Font test')).getByText('Winner: B')).toBeInTheDocument()
    expect(within(expRow('Color test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Color test')).getByText('Winner: A')).toBeInTheDocument()
  })

  it('done experiment has no Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Navbar test')
    await u.click(within(expRow('Navbar test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Navbar test')).getByRole('button', { name: /winner: a/i }))
    expect(within(expRow('Navbar test')).queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
  })

  it('win rate rounds correctly for one-of-three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'E1')
    await addExp(u, 'E2')
    await addExp(u, 'E3')
    await u.click(within(expRow('E1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E1')).getByRole('button', { name: /winner: a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/win rate: 33%/i)).toBeInTheDocument()
    expect(screen.getByText(/total: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 2/i)).toBeInTheDocument()
  })

  it('a wins and b wins count correctly with multiple experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'T1')
    await addExp(u, 'T2')
    await addExp(u, 'T3')
    await u.click(within(expRow('T1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('T1')).getByRole('button', { name: /winner: a/i }))
    await u.click(within(expRow('T2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('T2')).getByRole('button', { name: /winner: a/i }))
    await u.click(within(expRow('T3')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('T3')).getByRole('button', { name: /winner: b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/a wins: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/b wins: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 100%/i)).toBeInTheDocument()
  })

  it('filter Done count updates after completing an experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Search test')
    await addExp(u, 'Map test')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    await u.click(within(expRow('Search test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Search test')).getByRole('button', { name: /winner: b/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Search test')).toBeInTheDocument()
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

  it('adding experiments after navigating away preserves previous ones', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'First')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    await addExp(u, 'Second')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('stats update after completing experiment (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'CV1')
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 0/i)).toBeInTheDocument()
    await nav(u, 'Experiments')
    await u.click(within(expRow('CV1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('CV1')).getByRole('button', { name: /winner: a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/running: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 100%/i)).toBeInTheDocument()
  })
})
