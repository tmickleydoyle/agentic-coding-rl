import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText('Metric name'))
  await u.type(screen.getByLabelText('Metric name'), name)
  await u.clear(screen.getByLabelText('Value'))
  await u.type(screen.getByLabelText('Value'), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Log app', () => {
  it('starts on the Log view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
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

  it('navigates back to Log view after visiting others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('adds an entry and shows it with order #1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '1200.50')
    expect(screen.getByText(/^#1 Revenue:/)).toBeInTheDocument()
  })

  it('first entry for a metric shows — trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '45')
    const item = screen.getByText(/^#1 CPU:/)
    expect(item.textContent).toContain('—')
  })

  it('second entry higher than first shows ↑ trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '45')
    await addEntry(u, 'CPU', '60')
    const item = screen.getByText(/^#2 CPU:/)
    expect(item.textContent).toContain('↑')
  })

  it('second entry lower than first shows ↓ trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Errors', '10')
    await addEntry(u, 'Errors', '3')
    const item = screen.getByText(/^#2 Errors:/)
    expect(item.textContent).toContain('↓')
  })

  it('equal consecutive values show — trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Latency', '50')
    await addEntry(u, 'Latency', '50')
    const item = screen.getByText(/^#2 Latency:/)
    expect(item.textContent).toContain('—')
  })

  it('different metrics do not affect each other trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '100')
    await addEntry(u, 'Beta', '5')
    const alphaItem = screen.getByText(/^#1 Alpha:/)
    const betaItem = screen.getByText(/^#2 Beta:/)
    expect(alphaItem.textContent).toContain('—')
    expect(betaItem.textContent).toContain('—')
  })

  it('ignores entry with blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Metric name'))
    await u.type(screen.getByLabelText('Value'), '99')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/^#1/)).not.toBeInTheDocument()
  })

  it('ignores entry with blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Metric name'), 'Requests')
    await u.clear(screen.getByLabelText('Value'))
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/^#1/)).not.toBeInTheDocument()
  })

  it('ignores entry with non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Metric name'), 'Score')
    await u.type(screen.getByLabelText('Value'), 'abc')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByText(/^#1/)).not.toBeInTheDocument()
  })

  it('filter shows only matching metric rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'Memory', '60')
    await u.type(screen.getByLabelText('Filter by metric'), 'CPU')
    expect(screen.getByText(/^#1 CPU:/)).toBeInTheDocument()
    expect(screen.queryByText(/Memory/)).not.toBeInTheDocument()
  })

  it('filter is case-insensitive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Revenue', '500')
    await u.type(screen.getByLabelText('Filter by metric'), 'revenue')
    expect(screen.getByText(/^#1 Revenue:/)).toBeInTheDocument()
  })

  it('clear all removes all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await addEntry(u, 'Y', '2')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryByText(/^#1/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^#2/)).not.toBeInTheDocument()
  })

  it('dashboard shows No data yet when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('dashboard shows correct total entries and unique metrics (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '50')
    await addEntry(u, 'CPU', '70')
    await addEntry(u, 'Memory', '30')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 2')).toBeInTheDocument()
  })

  it('dashboard shows latest value and count per metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '50')
    await addEntry(u, 'CPU', '75')
    await nav(u, 'Dashboard')
    expect(screen.getByText('CPU: latest 75.00, entries 2')).toBeInTheDocument()
  })

  it('dashboard lists metrics in order of first appearance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zebra', '1')
    await addEntry(u, 'Apple', '2')
    await nav(u, 'Dashboard')
    const items = screen.getAllByText(/: latest/)
    expect(items[0].textContent).toMatch(/^Zebra/)
    expect(items[1].textContent).toMatch(/^Apple/)
  })

  it('decimal places setting affects log display (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Rate', '3.14159')
    await nav(u, 'Settings')
    await u.selectOptions(screen.getByLabelText('Decimal places'), '0')
    await nav(u, 'Log')
    expect(screen.getByText(/^#1 Rate: 3 /)).toBeInTheDocument()
  })

  it('decimal places setting affects dashboard display', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '9.876')
    await nav(u, 'Settings')
    await u.selectOptions(screen.getByLabelText('Decimal places'), '1')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Score: latest 9.9, entries 1')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Log')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('log state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Uptime', '99.9')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText(/^#1 Uptime:/)).toBeInTheDocument()
  })
})
