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

describe('Metrics Log app', () => {
  it('starts on the Log view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('shows nav buttons for all three views', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Log' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates to Dashboard and back to Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a metric entry and shows it in the table', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '72')
    expect(screen.getByText('CPU')).toBeInTheDocument()
    expect(screen.getByText('72')).toBeInTheDocument()
  })

  it('assigns sequential entry numbers starting at 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'RAM', '50')
    await addEntry(u, 'RAM', '60')
    const rows = screen.getAllByRole('row')
    // rows[0] is header
    expect(within(rows[1]).getByText('1')).toBeInTheDocument()
    expect(within(rows[2]).getByText('2')).toBeInTheDocument()
  })

  it('ignores an entry with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/metric name/i))
    await u.type(screen.getByLabelText(/^value$/i), '100')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('row').length).toBe(1) // only header
  })

  it('ignores an entry with a blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'CPU')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('row').length).toBe(1)
  })

  it('ignores an entry with a non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', 'abc')
    expect(screen.queryAllByRole('row').length).toBe(1)
  })

  it('shows Trend column heading by default', () => {
    render(<App />)
    expect(screen.getByRole('columnheader', { name: 'Trend' })).toBeInTheDocument()
  })

  it('shows – trend for the only entry of a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '30')
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('–')).toBeInTheDocument()
  })

  it('shows ↑ trend when latest value is higher', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '10')
    await addEntry(u, 'Load', '20')
    const rows = screen.getAllByRole('row')
    // row 2 is the latest
    expect(within(rows[2]).getByText('↑')).toBeInTheDocument()
    // row 1 has no trend
    expect(within(rows[1]).queryByText('↑')).not.toBeInTheDocument()
    expect(within(rows[1]).queryByText('↓')).not.toBeInTheDocument()
    expect(within(rows[1]).queryByText('–')).not.toBeInTheDocument()
  })

  it('shows ↓ trend when latest value is lower', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '50')
    await addEntry(u, 'Errors', '30')
    const rows = screen.getAllByRole('row')
    expect(within(rows[2]).getByText('↓')).toBeInTheDocument()
  })

  it('shows – trend when latest value equals previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Uptime', '99')
    await addEntry(u, 'Uptime', '99')
    const rows = screen.getAllByRole('row')
    expect(within(rows[2]).getByText('–')).toBeInTheDocument()
  })

  it('clears all entries with the Clear all button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'CPU', '90')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByRole('row').length).toBe(1) // only header
  })

  it('shows No data yet on Dashboard when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('shows total entries and per-metric summary on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '70')
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'RAM', '40')
    await nav(u, 'Dashboard')
    expect(screen.getByText('CPU: 2 entries, latest 80')).toBeInTheDocument()
    expect(screen.getByText('RAM: 1 entries, latest 40')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
  })

  it('Dashboard reflects latest value after cross-view log addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '100')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Score: 1 entries, latest 100')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'Score', '200')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Score: 2 entries, latest 200')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
  })

  it('theme toggles light to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Log')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides Trend column when Show trend column is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend column/i))
    await nav(u, 'Log')
    expect(screen.queryByRole('columnheader', { name: 'Trend' })).not.toBeInTheDocument()
  })

  it('restores Trend column when Show trend column is re-checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend column/i))
    await u.click(screen.getByLabelText(/show trend column/i))
    await nav(u, 'Log')
    expect(screen.getByRole('columnheader', { name: 'Trend' })).toBeInTheDocument()
  })

  it('preserves log state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Disk', '55')
    await nav(u, 'Settings')
    await nav(u, 'Log')
    expect(screen.getByText('Disk')).toBeInTheDocument()
    expect(screen.getByText('55')).toBeInTheDocument()
  })

  it('trend updates only the most-recent row for each metric independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '10')
    await addEntry(u, 'B', '5')
    await addEntry(u, 'A', '20')
    const rows = screen.getAllByRole('row')
    // row1 = A/10 (not latest for A, no trend)
    expect(within(rows[1]).queryByText('↑')).not.toBeInTheDocument()
    // row2 = B/5 (latest for B, only one -> –)
    expect(within(rows[2]).getByText('–')).toBeInTheDocument()
    // row3 = A/20 (latest for A, up from 10 -> ↑)
    expect(within(rows[3]).getByText('↑')).toBeInTheDocument()
  })
})
