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
  it('starts on the Log view with the table headers', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
    expect(screen.getByText('Metric')).toBeInTheDocument()
    expect(screen.getByText('Latest Value')).toBeInTheDocument()
    expect(screen.getByText('Trend')).toBeInTheDocument()
  })

  it('shows Metrics tracked: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
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

  it('adds a single entry and shows it in the table', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1000')
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('Metrics tracked: 1')).toBeInTheDocument()
  })

  it('first entry for a metric shows stable trend —', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Users', '50')
    const rows = screen.getAllByRole('row')
    // find the data row
    const dataRow = rows.find((r) => within(r).queryByText('Users'))
    expect(dataRow).toBeTruthy()
    expect(within(dataRow!).getByText('—')).toBeInTheDocument()
  })

  it('shows rising trend ▲ when latest value increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '10')
    await addEntry(u, 'Score', '20')
    const rows = screen.getAllByRole('row')
    const dataRow = rows.find((r) => within(r).queryByText('Score'))
    expect(within(dataRow!).getByText('▲')).toBeInTheDocument()
    expect(within(dataRow!).getByText('20')).toBeInTheDocument()
  })

  it('shows falling trend ▼ when latest value decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '100')
    await addEntry(u, 'Errors', '40')
    const rows = screen.getAllByRole('row')
    const dataRow = rows.find((r) => within(r).queryByText('Errors'))
    expect(within(dataRow!).getByText('▼')).toBeInTheDocument()
    expect(within(dataRow!).getByText('40')).toBeInTheDocument()
  })

  it('shows — trend when consecutive values are equal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Churn', '5')
    await addEntry(u, 'Churn', '5')
    const rows = screen.getAllByRole('row')
    const dataRow = rows.find((r) => within(r).queryByText('Churn'))
    expect(within(dataRow!).getByText('—')).toBeInTheDocument()
  })

  it('shows only the latest value per metric (not all entries)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Visits', '10')
    await addEntry(u, 'Visits', '20')
    await addEntry(u, 'Visits', '30')
    // Only one row for Visits
    const cells = screen.getAllByRole('cell')
    const visitCells = cells.filter((c) => c.textContent === 'Visits')
    expect(visitCells).toHaveLength(1)
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.queryByText('10')).not.toBeInTheDocument()
    expect(screen.queryByText('20')).not.toBeInTheDocument()
  })

  it('ignores blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/metric name/i))
    await u.type(screen.getByLabelText(/^value$/i), '99')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
  })

  it('ignores blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'NoBlanks')
    await u.clear(screen.getByLabelText(/^value$/i))
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
  })

  it('ignores non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'BadVal')
    await u.type(screen.getByLabelText(/^value$/i), 'abc')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
  })

  it('deletes all entries for a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '500')
    await addEntry(u, 'Revenue', '600')
    await addEntry(u, 'Costs', '200')
    expect(screen.getByText('Metrics tracked: 2')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Revenue' }))
    expect(screen.queryByText('Revenue')).not.toBeInTheDocument()
    expect(screen.getByText('Metrics tracked: 1')).toBeInTheDocument()
    expect(screen.getByText('Costs')).toBeInTheDocument()
  })

  it('dashboard shows zero stats when no entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
    expect(screen.getByText('Distinct metrics: 0')).toBeInTheDocument()
    expect(screen.getByText('Rising: 0')).toBeInTheDocument()
    expect(screen.getByText('Falling: 0')).toBeInTheDocument()
    expect(screen.getByText('Stable: 0')).toBeInTheDocument()
  })

  it('dashboard total entries counts all individual entries (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'DAU', '100')
    await addEntry(u, 'DAU', '120')
    await addEntry(u, 'MAU', '3000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Distinct metrics: 2')).toBeInTheDocument()
  })

  it('dashboard correctly counts rising, falling, stable (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Up', '10')
    await addEntry(u, 'Up', '20')
    await addEntry(u, 'Down', '50')
    await addEntry(u, 'Down', '30')
    await addEntry(u, 'Flat', '7')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Rising: 1')).toBeInTheDocument()
    expect(screen.getByText('Falling: 1')).toBeInTheDocument()
    expect(screen.getByText('Stable: 1')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('clear all entries resets Log view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '999')
    await addEntry(u, 'Costs', '400')
    expect(screen.getByText('Metrics tracked: 2')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
    expect(screen.queryByText('Revenue')).not.toBeInTheDocument()
  })

  it('clear all entries resets Dashboard view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '999')
    await addEntry(u, 'Revenue', '1200')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 0')).toBeInTheDocument()
    expect(screen.getByText('Rising: 0')).toBeInTheDocument()
  })

  it('multiple metrics tracked count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await addEntry(u, 'C', '3')
    await addEntry(u, 'A', '5')
    expect(screen.getByText('Metrics tracked: 3')).toBeInTheDocument()
  })

  it('log state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Signups', '42')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('Signups')).toBeInTheDocument()
    expect(screen.getByText('Metrics tracked: 1')).toBeInTheDocument()
  })
})
