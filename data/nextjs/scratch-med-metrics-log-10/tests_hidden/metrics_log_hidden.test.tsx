// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Metrics Log (held-out)', () => {
  it('order numbers increment sequentially across different metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await addEntry(u, 'A', '3')
    expect(screen.getByText(/^#1 A:/)).toBeInTheDocument()
    expect(screen.getByText(/^#2 B:/)).toBeInTheDocument()
    expect(screen.getByText(/^#3 A:/)).toBeInTheDocument()
  })

  it('after clear all, new entries start at #1 again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '10')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'Y', '20')
    expect(screen.getByText(/^#1 Y:/)).toBeInTheDocument()
  })

  it('trend for third entry of same metric compared to second, not first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '100')
    await addEntry(u, 'Temp', '90')
    await addEntry(u, 'Temp', '95')
    // third entry (95) > second entry (90) => ↑
    const thirdItem = screen.getByText(/^#3 Temp:/)
    expect(thirdItem.textContent).toContain('↑')
    // second entry (90) < first entry (100) => ↓
    const secondItem = screen.getByText(/^#2 Temp:/)
    expect(secondItem.textContent).toContain('↓')
  })

  it('filter partial match works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'RequestCount', '50')
    await addEntry(u, 'ErrorRate', '5')
    await u.type(screen.getByLabelText('Filter by metric'), 'Count')
    expect(screen.getByText(/RequestCount/)).toBeInTheDocument()
    expect(screen.queryByText(/ErrorRate/)).not.toBeInTheDocument()
  })

  it('clearing filter shows all entries again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '50')
    await addEntry(u, 'GPU', '70')
    await u.type(screen.getByLabelText('Filter by metric'), 'CPU')
    expect(screen.queryByText(/GPU/)).not.toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter by metric'))
    expect(screen.getByText(/^#1 CPU:/)).toBeInTheDocument()
    expect(screen.getByText(/^#2 GPU:/)).toBeInTheDocument()
  })

  it('dashboard updates after adding more entries (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '1000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'Sales', '1500')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
    expect(screen.getByText('Sales: latest 1500.00, entries 2')).toBeInTheDocument()
  })

  it('dashboard disappears No data yet once first entry is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'Ping', '20')
    await nav(u, 'Dashboard')
    expect(screen.queryByText('No data yet')).not.toBeInTheDocument()
  })

  it('dashboard shows No data yet after clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Metric', '5')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('decimal places 2 is the default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Pi', '3.14159')
    expect(screen.getByText(/^#1 Pi: 3.14 /)).toBeInTheDocument()
  })

  it('switching decimal places to 1 then back to 2 works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Val', '7.777')
    await nav(u, 'Settings')
    await u.selectOptions(screen.getByLabelText('Decimal places'), '1')
    await nav(u, 'Log')
    expect(screen.getByText(/^#1 Val: 7.8 /)).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.selectOptions(screen.getByLabelText('Decimal places'), '2')
    await nav(u, 'Log')
    expect(screen.getByText(/^#1 Val: 7.78 /)).toBeInTheDocument()
  })

  it('theme toggle button text reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('multiple metrics in dashboard each show their own latest and count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '10')
    await addEntry(u, 'Alpha', '20')
    await addEntry(u, 'Beta', '99')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Unique metrics: 2')).toBeInTheDocument()
    expect(screen.getByText('Alpha: latest 20.00, entries 2')).toBeInTheDocument()
    expect(screen.getByText('Beta: latest 99.00, entries 1')).toBeInTheDocument()
  })
})
