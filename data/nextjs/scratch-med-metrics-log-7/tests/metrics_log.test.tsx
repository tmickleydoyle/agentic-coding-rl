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
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('first entry for a metric shows — trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Users', '50')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
  })

  it('second entry with higher value shows ↑ trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '100')
    await addEntry(u, 'Sales', '150')
    const items = screen.getAllByRole('listitem')
    // newest first
    expect(within(items[0]).getByText('↑')).toBeInTheDocument()
  })

  it('second entry with lower value shows ↓ trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '20')
    await addEntry(u, 'Errors', '5')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('↓')).toBeInTheDocument()
  })

  it('second entry with same value shows → trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '42')
    await addEntry(u, 'Score', '42')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('→')).toBeInTheDocument()
  })

  it('different metrics do not cross-contaminate trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '10')
    await addEntry(u, 'Beta', '200')
    const items = screen.getAllByRole('listitem')
    // Beta is newest — no prior Beta entry so trend should be —
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
    // Alpha entry trend is also —
    expect(within(items[1]).getByText('—')).toBeInTheDocument()
  })

  it('ignores blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^value$/i), '99')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Test')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('ignores non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Test', 'abc')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('clear all removes all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await addEntry(u, 'X', '2')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('dashboard shows No entries yet when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No entries yet')).toBeInTheDocument()
  })

  it('dashboard reflects total entries and unique metrics (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '200')
    await addEntry(u, 'Users', '50')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 2')).toBeInTheDocument()
  })

  it('dashboard shows latest value and trend per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '250')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Revenue: latest=250 trend=↑')).toBeInTheDocument()
  })

  it('dashboard first metric has — trend when only one entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bounce', '30')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Bounce: latest=30 trend=—')).toBeInTheDocument()
  })

  it('settings toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Log')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('show all entries checkbox unchecked filters log to latest per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '60')
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'CPU', '70')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i))
    await nav(u, 'Log')
    const items = screen.getAllByRole('listitem')
    // Only latest entry for CPU (#3) should show
    expect(items).toHaveLength(1)
    expect(within(items[0]).getByText('#3')).toBeInTheDocument()
  })

  it('show all entries off shows only latest per metric when multiple metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '60')
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'Memory', '30')
    await addEntry(u, 'Memory', '40')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i))
    await nav(u, 'Log')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Retention', '75')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('Retention')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('entry order increments globally across metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '1')
    await addEntry(u, 'Beta', '2')
    await addEntry(u, 'Alpha', '3')
    // newest first: Alpha#3, Beta#2, Alpha#1
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('#3')).toBeInTheDocument()
    expect(within(items[1]).getByText('#2')).toBeInTheDocument()
    expect(within(items[2]).getByText('#1')).toBeInTheDocument()
  })
})
