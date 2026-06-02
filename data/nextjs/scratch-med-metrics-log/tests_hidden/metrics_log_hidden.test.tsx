// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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
  it('entries count increments with each valid entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '200')
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
    await addEntry(u, 'Sales', '250')
    expect(screen.getByText('Entries: 2')).toBeInTheDocument()
    await addEntry(u, 'Leads', '30')
    expect(screen.getByText('Entries: 3')).toBeInTheDocument()
  })

  it('trend for third entry of same metric compares to second, not first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Pulse', '60')
    await addEntry(u, 'Pulse', '80')
    await addEntry(u, 'Pulse', '70')
    // third Pulse: 70 < 80 => ▼
    const items = screen.getAllByRole('listitem')
    expect(within(items[2]).getByLabelText('trend').textContent).toBe('▼')
  })

  it('deleting middle entry adjusts count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '10')
    await addEntry(u, 'Load', '20')
    await addEntry(u, 'Load', '30')
    await u.click(screen.getByRole('button', { name: /delete load 20/i }))
    expect(screen.getByText('Entries: 2')).toBeInTheDocument()
  })

  it('dashboard metric order follows first appearance in log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zebra', '1')
    await addEntry(u, 'Alpha', '2')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Zebra')).toBeInTheDocument()
    expect(within(items[1]).getByText('Alpha')).toBeInTheDocument()
  })

  it('dashboard latest value updates after a new entry is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'NPS', '40')
    await nav(u, 'Dashboard')
    const itemsBefore = screen.getAllByRole('listitem')
    expect(within(itemsBefore[0]).getByText('40')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'NPS', '55')
    await nav(u, 'Dashboard')
    const itemsAfter = screen.getAllByRole('listitem')
    expect(within(itemsAfter[0]).getByText('55')).toBeInTheDocument()
  })

  it('clear all and then re-add starts fresh with correct counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Err', '5')
    await addEntry(u, 'Err', '3')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
    await addEntry(u, 'Err', '1')
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
    // only one entry for Err so no trend
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).queryAllByLabelText('trend')).toHaveLength(0)
  })

  it('two different metrics interleaved — each gets its own trend chain', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '10')
    await addEntry(u, 'B', '100')
    await addEntry(u, 'A', '10') // equal to first A => —
    await addEntry(u, 'B', '200') // higher than first B => ▲
    const items = screen.getAllByRole('listitem')
    expect(within(items[2]).getByLabelText('trend').textContent).toBe('—')
    expect(within(items[3]).getByLabelText('trend').textContent).toBe('▲')
  })

  it('theme toggle button text updates to reflect new theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('dashboard shows one entry count for single-entry metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Solo', '99')
    await nav(u, 'Dashboard')
    expect(screen.getByText('(1 entries)')).toBeInTheDocument()
    expect(screen.getByText('Metrics tracked: 1')).toBeInTheDocument()
  })

  it('log state is preserved after navigating to Dashboard and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Margin', '18')
    await addEntry(u, 'Margin', '22')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 2')).toBeInTheDocument()
  })
})
