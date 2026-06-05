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
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('navigates to Dashboard and Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('adds an entry and updates Entries count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('ignores blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^value$/i), '42')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('ignores blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'CPU')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('ignores non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'CPU')
    await u.type(screen.getByLabelText(/^value$/i), 'abc')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('shows no trend indicator for the first entry of a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '50')
    const items = screen.getAllByRole('listitem')
    const trendSpans = within(items[0]).queryAllByLabelText('trend')
    expect(trendSpans).toHaveLength(0)
  })

  it('shows up arrow when value increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '50')
    await addEntry(u, 'Score', '75')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByLabelText('trend').textContent).toBe('▲')
  })

  it('shows down arrow when value decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '80')
    await addEntry(u, 'Score', '60')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByLabelText('trend').textContent).toBe('▼')
  })

  it('shows em dash when value is equal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '70')
    await addEntry(u, 'Score', '70')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByLabelText('trend').textContent).toBe('—')
  })

  it('computes trend relative to the previous entry for the SAME metric, not the prior row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '30')
    await addEntry(u, 'RAM', '80')
    await addEntry(u, 'CPU', '20')
    // CPU at index 2 should compare to CPU at index 0 (value 30), so 20 < 30 => ▼
    const items = screen.getAllByRole('listitem')
    expect(within(items[2]).getByLabelText('trend').textContent).toBe('▼')
    // RAM at index 1 has no prior RAM entry => no trend
    expect(within(items[1]).queryAllByLabelText('trend')).toHaveLength(0)
  })

  it('deletes an entry and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '37')
    await addEntry(u, 'Temp', '38')
    expect(screen.getByText('Entries: 2')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete temp 37/i }))
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
  })

  it('clears input fields after adding an entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bounce', '45')
    expect(screen.getByLabelText(/metric name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^value$/i)).toHaveValue('')
  })

  it('dashboard shows Metrics tracked and Total entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    await addEntry(u, 'Revenue', '1100')
    await addEntry(u, 'Visitors', '500')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Metrics tracked: 2')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
  })

  it('dashboard shows latest value for each metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    await addEntry(u, 'Revenue', '1200')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('1200')).toBeInTheDocument()
  })

  it('dashboard shows entry count per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    await addEntry(u, 'Revenue', '1100')
    await addEntry(u, 'Revenue', '1200')
    await nav(u, 'Dashboard')
    expect(screen.getByText('(3 entries)')).toBeInTheDocument()
  })

  it('dashboard updates after deleting an entry (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '55')
    await addEntry(u, 'CPU', '60')
    await u.click(screen.getByRole('button', { name: /delete cpu 60/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('55')).toBeInTheDocument()
    expect(screen.getByText('(1 entries)')).toBeInTheDocument()
  })

  it('clear all entries removes everything and dashboard shows 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '10')
    await addEntry(u, 'Y', '20')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme attribute across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves log state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Latency', '120')
    await nav(u, 'Settings')
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
    expect(screen.getByText('Latency')).toBeInTheDocument()
  })

  it('dashboard starts empty with 0 metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
  })
})
