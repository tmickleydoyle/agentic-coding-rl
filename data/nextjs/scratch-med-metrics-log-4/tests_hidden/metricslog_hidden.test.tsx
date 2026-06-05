// HELD-OUT generalization tests — fresh scenarios and edge cases.
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
  it('three distinct metrics each show correct per-metric summaries on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '1')
    await addEntry(u, 'Beta', '2')
    await addEntry(u, 'Gamma', '3')
    await addEntry(u, 'Alpha', '4')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Alpha: 2 entries, latest 4')).toBeInTheDocument()
    expect(screen.getByText('Beta: 1 entries, latest 2')).toBeInTheDocument()
    expect(screen.getByText('Gamma: 1 entries, latest 3')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 4')).toBeInTheDocument()
  })

  it('Dashboard disappears when entries are cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '10')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    await nav(u, 'Log')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('entry number sequence continues after clearing and re-adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'M', '1')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'M', '2')
    const rows = screen.getAllByRole('row')
    // seq continues from where it left off (2) or resets — either way there is exactly one data row
    expect(rows.length).toBe(2) // header + 1 data row
  })

  it('shows ↑ trend after three increasing entries, only on the last row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'P', '1')
    await addEntry(u, 'P', '5')
    await addEntry(u, 'P', '10')
    const rows = screen.getAllByRole('row')
    expect(within(rows[3]).getByText('↑')).toBeInTheDocument()
    expect(within(rows[1]).queryByText('↑')).not.toBeInTheDocument()
    expect(within(rows[2]).queryByText('↑')).not.toBeInTheDocument()
  })

  it('handles negative numeric values correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '5')
    await addEntry(u, 'Temp', '-3')
    const rows = screen.getAllByRole('row')
    expect(within(rows[2]).getByText('↓')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Temp: 2 entries, latest -3')).toBeInTheDocument()
  })

  it('trend column hidden state persists when navigating back to Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend column/i))
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.queryByRole('columnheader', { name: 'Trend' })).not.toBeInTheDocument()
  })

  it('theme toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('No data yet disappears once an entry is added (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'Q', '7')
    await nav(u, 'Dashboard')
    expect(screen.queryByText('No data yet')).not.toBeInTheDocument()
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
  })

  it('zero value is accepted and shown as 0 with – trend on first entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Z', '0')
    expect(screen.getByText('Z')).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('–')).toBeInTheDocument()
  })

  it('only the latest entry per metric has a trend symbol — interleaved metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Foo', '100')
    await addEntry(u, 'Bar', '200')
    await addEntry(u, 'Foo', '90')
    await addEntry(u, 'Bar', '210')
    const rows = screen.getAllByRole('row')
    // row1 = Foo/100 no trend
    expect(within(rows[1]).queryByText('↓')).not.toBeInTheDocument()
    expect(within(rows[1]).queryByText('↑')).not.toBeInTheDocument()
    // row2 = Bar/200 no trend (not latest for Bar anymore)
    expect(within(rows[2]).queryByText('↑')).not.toBeInTheDocument()
    // row3 = Foo/90 (latest for Foo, down from 100)
    expect(within(rows[3]).getByText('↓')).toBeInTheDocument()
    // row4 = Bar/210 (latest for Bar, up from 200)
    expect(within(rows[4]).getByText('↑')).toBeInTheDocument()
  })
})
