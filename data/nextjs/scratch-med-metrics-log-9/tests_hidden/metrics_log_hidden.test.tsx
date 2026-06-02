// HELD-OUT generalization tests — never seen by the agent. Fresh scenarios.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText(/metric name/i))
  await u.type(screen.getByLabelText(/metric name/i), name)
  await u.clear(screen.getByLabelText(/^value$/i))
  await u.type(screen.getByLabelText(/^value$/i), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Log (held-out)', () => {
  it('multiple different metrics each get their own trend on latest', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '10')
    await addEntry(u, 'Beta', '20')
    // Both are first entries so both should show —
    const indicators = screen.queryAllByText('—')
    expect(indicators).toHaveLength(2)
  })

  it('trend updates correctly after three entries for same metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '5')
    await addEntry(u, 'Score', '10')
    await addEntry(u, 'Score', '7')
    // Latest is 7 < 10 so trend is ▼
    expect(screen.getByText('▼')).toBeInTheDocument()
    // Only one trend indicator visible
    expect(screen.queryAllByText(/^[▲▼—]$/)).toHaveLength(1)
  })

  it('Dashboard Unique metrics count updates after clear and re-add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await addEntry(u, 'Y', '2')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'Z', '3')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 1')).toBeInTheDocument()
  })

  it('Dashboard shows correct latest when same metric entered many times', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '30')
    await addEntry(u, 'Temp', '32')
    await addEntry(u, 'Temp', '28')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Temp: 28')).toBeInTheDocument()
  })

  it('re-enabling trend indicators makes them visible again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Profit', '100')
    await addEntry(u, 'Profit', '150')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend indicators/i)) // hide
    await nav(u, 'Log')
    expect(screen.queryByText('▲')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend indicators/i)) // show again
    await nav(u, 'Log')
    expect(screen.getByText('▲')).toBeInTheDocument()
  })

  it('entries appear newest first in the log list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await addEntry(u, 'C', '3')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('C: 3')).toBeInTheDocument()
    expect(within(items[2]).getByText('A: 1')).toBeInTheDocument()
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

  it('Dashboard total entries counts all entries including duplicates for same metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'MRR', '1000')
    await addEntry(u, 'MRR', '1100')
    await addEntry(u, 'MRR', '1200')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 1')).toBeInTheDocument()
  })
})
