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

  it('navigates to Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('adds an entry and shows it in the log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    expect(screen.getByText('Revenue: 1000')).toBeInTheDocument()
  })

  it('ignores entry when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/metric name/i))
    await u.clear(screen.getByLabelText(/^value$/i))
    await u.type(screen.getByLabelText(/^value$/i), '42')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    const list = screen.getByRole('list')
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores entry when value is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'CPU')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    const list = screen.getByRole('list')
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores entry when value is not a number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', 'abc')
    const list = screen.getByRole('list')
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('shows up trend indicator on latest entry when value increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '100')
    await addEntry(u, 'Sales', '200')
    expect(screen.getByText('Sales: 200 ↑')).toBeInTheDocument()
  })

  it('shows down trend indicator on latest entry when value decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '50')
    await addEntry(u, 'Errors', '30')
    expect(screen.getByText('Errors: 30 ↓')).toBeInTheDocument()
  })

  it('shows flat trend indicator when value is equal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Latency', '10')
    await addEntry(u, 'Latency', '10')
    expect(screen.getByText('Latency: 10 →')).toBeInTheDocument()
  })

  it('first entry for a metric shows no trend indicator', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '75')
    expect(screen.getByText('Load: 75')).toBeInTheDocument()
  })

  it('older entries for the same metric show no trend indicator', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '10')
    await addEntry(u, 'Score', '20')
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toBe('Score: 10')
    expect(items[1].textContent).toBe('Score: 20 ↑')
  })

  it('Clear all removes all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('Dashboard shows correct total entries and unique metrics (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'CPU', '90')
    await addEntry(u, 'RAM', '60')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 2')).toBeInTheDocument()
  })

  it('Dashboard shows latest value with trend for a metric that has multiple entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '500')
    await addEntry(u, 'Revenue', '800')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Revenue: 800 ↑')).toBeInTheDocument()
  })

  it('Dashboard shows value with no trend for a metric with only one entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sessions', '42')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Sessions: 42')).toBeInTheDocument()
  })

  it('Dashboard shows zero totals when no entries exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 0')).toBeInTheDocument()
  })

  it('Reset log in Settings clears entries visible in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset log/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
  })

  it('theme toggles to dark and persists across views', async () => {
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

  it('entries persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bounce', '35')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('Bounce: 35')).toBeInTheDocument()
  })

  it('interleaved metrics each show independent trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '10')
    await addEntry(u, 'B', '5')
    await addEntry(u, 'A', '8')
    await addEntry(u, 'B', '9')
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toBe('A: 10')
    expect(items[1].textContent).toBe('B: 5')
    expect(items[2].textContent).toBe('A: 8 ↓')
    expect(items[3].textContent).toBe('B: 9 ↑')
  })
})
