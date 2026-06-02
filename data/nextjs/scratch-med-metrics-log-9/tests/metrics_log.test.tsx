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

  it('adds an entry and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1500')
    expect(screen.getByText('Revenue: 1500')).toBeInTheDocument()
  })

  it('ignores an entry with blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^value$/i), '100')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores an entry with blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Revenue')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores an entry with a non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', 'abc')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('shows — for the first entry of a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Signups', '10')
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows ▲ when latest value is higher than previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Signups', '10')
    await addEntry(u, 'Signups', '20')
    expect(screen.getByText('▲')).toBeInTheDocument()
  })

  it('shows ▼ when latest value is lower than previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Signups', '20')
    await addEntry(u, 'Signups', '5')
    expect(screen.getByText('▼')).toBeInTheDocument()
  })

  it('shows — when latest value equals previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Signups', '10')
    await addEntry(u, 'Signups', '10')
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('only shows trend on the latest entry per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '5')
    await addEntry(u, 'Score', '8')
    // newest is first in reversed list; only one trend symbol visible
    const indicators = screen.queryAllByText(/^[▲▼—]$/)
    expect(indicators).toHaveLength(1)
  })

  it('clears all entries with Clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    await addEntry(u, 'Revenue', '2000')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('shows No metrics logged yet on empty Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet.')).toBeInTheDocument()
  })

  it('Dashboard shows Total entries and Unique metrics (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '200')
    await addEntry(u, 'Signups', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 2')).toBeInTheDocument()
  })

  it('Dashboard shows latest value per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '250')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Revenue: 250')).toBeInTheDocument()
  })

  it('Dashboard lists metrics in alphabetical order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zebra', '1')
    await addEntry(u, 'Apple', '2')
    await nav(u, 'Dashboard')
    const items = screen.getAllByText(/^[A-Z][a-z]+: \d+$/)
    expect(items[0].textContent).toBe('Apple: 2')
    expect(items[1].textContent).toBe('Zebra: 1')
  })

  it('theme toggles via Settings and persists across views', async () => {
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

  it('Show trend indicators checkbox hides trends when unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Churn', '5')
    await addEntry(u, 'Churn', '3')
    expect(screen.getByText('▼')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show trend indicators/i))
    await nav(u, 'Log')
    expect(screen.queryByText('▼')).not.toBeInTheDocument()
    expect(screen.queryByText('▲')).not.toBeInTheDocument()
    expect(screen.queryByText('—')).not.toBeInTheDocument()
  })

  it('entries persist when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'NPS', '42')
    await nav(u, 'Settings')
    await nav(u, 'Log')
    expect(screen.getByText('NPS: 42')).toBeInTheDocument()
  })

  it('after Clear all Dashboard shows No metrics logged yet', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '500')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet.')).toBeInTheDocument()
  })
})
