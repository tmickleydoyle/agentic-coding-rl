import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText(/metric name/i))
  await u.type(screen.getByLabelText(/metric name/i), name)
  await u.clear(screen.getByLabelText(/metric value/i))
  await u.type(screen.getByLabelText(/metric value/i), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Log app', () => {
  it('starts on the Log view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('shows Entries: 0 on start', () => {
    render(<App />)
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds an entry and shows it in the log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '500')
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
  })

  it('ignores blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/metric name/i))
    await u.type(screen.getByLabelText(/metric value/i), '100')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('ignores blank metric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Temp')
    await u.clear(screen.getByLabelText(/metric value/i))
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('ignores a non-numeric metric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Speed')
    await u.type(screen.getByLabelText(/metric value/i), 'fast')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('shows — trend for the first entry of a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Clicks', '10')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
  })

  it('shows ▲ trend when value increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Clicks', '10')
    await addEntry(u, 'Clicks', '20')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByText('▲')).toBeInTheDocument()
  })

  it('shows ▼ trend when value decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Clicks', '20')
    await addEntry(u, 'Clicks', '15')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByText('▼')).toBeInTheDocument()
  })

  it('shows — trend when value stays the same', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Clicks', '10')
    await addEntry(u, 'Clicks', '10')
    const items = screen.getAllByRole('listitem')
    expect(within(items[1]).getByText('—')).toBeInTheDocument()
  })

  it('trends are independent per metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Costs', '50')
    await addEntry(u, 'Revenue', '80')
    const items = screen.getAllByRole('listitem')
    // Revenue entry 1: —, Costs entry 1: —, Revenue entry 2: ▼
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
    expect(within(items[1]).getByText('—')).toBeInTheDocument()
    expect(within(items[2]).getByText('▼')).toBeInTheDocument()
  })

  it('deletes an entry and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sessions', '300')
    await addEntry(u, 'Sessions', '400')
    expect(screen.getByText('Entries: 2')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    const deleteBtn = within(items[0]).getByRole('button', { name: /delete/i })
    await u.click(deleteBtn)
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
  })

  it('shows No metrics logged yet on Dashboard when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet')).toBeInTheDocument()
  })

  it('Dashboard shows Tracked metrics and Total entries (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Costs', '50')
    await addEntry(u, 'Revenue', '120')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 2')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
  })

  it('Dashboard shows latest value and correct trend per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '70')
    await addEntry(u, 'Temp', '85')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('85')).toBeInTheDocument()
    expect(within(items[0]).getByText('▲')).toBeInTheDocument()
  })

  it('Dashboard shows — trend when only one entry for a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Pressure', '1013')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Log')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all entries resets log count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '200')
    await addEntry(u, 'Revenue', '300')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
  })

  it('Clear all entries causes Dashboard to show No metrics logged yet', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '999')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet')).toBeInTheDocument()
  })

  it('preserves log state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Bounce', '42')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('Bounce')).toBeInTheDocument()
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
  })
})
