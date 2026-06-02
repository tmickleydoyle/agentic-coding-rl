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

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('adds an entry and shows it in the correct format', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '4200')
    expect(screen.getByText('#1 — Revenue: 4200')).toBeInTheDocument()
  })

  it('increments the entry index for successive entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Costs', '50')
    expect(screen.getByText('#1 — Revenue: 100')).toBeInTheDocument()
    expect(screen.getByText('#2 — Costs: 50')).toBeInTheDocument()
  })

  it('ignores entries with a blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/metric name/i))
    await u.type(screen.getByLabelText(/^value$/i), '999')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/#1/)).not.toBeInTheDocument()
  })

  it('ignores entries with a blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Revenue')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/#1/)).not.toBeInTheDocument()
  })

  it('ignores entries with a non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Revenue')
    await u.type(screen.getByLabelText(/^value$/i), 'abc')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/#1/)).not.toBeInTheDocument()
  })

  it('clears all entries with Clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Costs', '50')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryByText(/#1/)).not.toBeInTheDocument()
  })

  it('shows No metrics logged yet on Dashboard when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet')).toBeInTheDocument()
  })

  it('shows correct Latest and Entries on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    await addEntry(u, 'Revenue', '1500')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Revenue' })
    expect(within(block).getByText('Latest: 1500')).toBeInTheDocument()
    expect(within(block).getByText('Entries: 2')).toBeInTheDocument()
  })

  it('shows Trend: up when latest is greater than previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '80')
    await addEntry(u, 'Score', '95')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Score' })
    expect(within(block).getByText('Trend: up')).toBeInTheDocument()
  })

  it('shows Trend: down when latest is less than previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '10')
    await addEntry(u, 'Errors', '3')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Errors' })
    expect(within(block).getByText('Trend: down')).toBeInTheDocument()
  })

  it('shows Trend: steady for a single entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Uptime', '99')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Uptime' })
    expect(within(block).getByText('Trend: steady')).toBeInTheDocument()
  })

  it('shows Trend: steady when latest equals previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Latency', '200')
    await addEntry(u, 'Latency', '200')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Latency' })
    expect(within(block).getByText('Trend: steady')).toBeInTheDocument()
  })

  it('Dashboard shows multiple unique metrics in first-seen order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '1')
    await addEntry(u, 'Beta', '2')
    await nav(u, 'Dashboard')
    expect(screen.getByRole('region', { name: 'Metric Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Metric Beta' })).toBeInTheDocument()
  })

  it('Show all entries toggle hides duplicate metrics in Log view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '200')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i))
    await nav(u, 'Log')
    // Only one Revenue row should show (the latest: #2)
    expect(screen.queryByText('#1 — Revenue: 100')).not.toBeInTheDocument()
    expect(screen.getByText('#2 — Revenue: 200')).toBeInTheDocument()
  })

  it('re-enabling Show all entries restores all rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '100')
    await addEntry(u, 'Revenue', '200')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i)) // uncheck
    await u.click(screen.getByLabelText(/show all entries/i)) // re-check
    await nav(u, 'Log')
    expect(screen.getByText('#1 — Revenue: 100')).toBeInTheDocument()
    expect(screen.getByText('#2 — Revenue: 200')).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme across views', async () => {
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

  it('state persists when navigating away and back to Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Conversion', '3.5')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('#1 — Conversion: 3.5')).toBeInTheDocument()
  })

  it('Dashboard reflects latest entry after multiple additions (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'DAU', '500')
    await addEntry(u, 'DAU', '750')
    await addEntry(u, 'DAU', '600')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric DAU' })
    expect(within(block).getByText('Latest: 600')).toBeInTheDocument()
    expect(within(block).getByText('Entries: 3')).toBeInTheDocument()
    expect(within(block).getByText('Trend: down')).toBeInTheDocument()
  })
})
