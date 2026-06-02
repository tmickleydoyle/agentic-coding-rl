// Held-out generalization tests — fresh scenarios not present in the visible suite.
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

describe('Metrics Log (held-out)', () => {
  it('adds multiple different metrics and all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '1')
    await addEntry(u, 'Beta', '2')
    await addEntry(u, 'Gamma', '3')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('Entries: 3')).toBeInTheDocument()
  })

  it('Dashboard tracked metrics count updates after adding a new unique metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '200')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 1')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'Errors', '5')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 2')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
  })

  it('Dashboard shows ▼ for a metric whose latest value dropped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '90')
    await addEntry(u, 'Score', '60')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('▼')).toBeInTheDocument()
    expect(within(items[0]).getByText('60')).toBeInTheDocument()
  })

  it('deleting an entry does not affect unrelated metrics in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CPU', '80')
    await addEntry(u, 'RAM', '60')
    const items = screen.getAllByRole('listitem')
    await u.click(within(items[0]).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 1')).toBeInTheDocument()
    expect(screen.getByText('RAM')).toBeInTheDocument()
  })

  it('after deleting the only entry for a metric, that metric no longer appears in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Uptime', '99')
    await addEntry(u, 'Latency', '30')
    // delete the Uptime entry
    const items = screen.getAllByRole('listitem')
    await u.click(within(items[0]).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.queryByText('Uptime')).not.toBeInTheDocument()
    expect(screen.getByText('Tracked metrics: 1')).toBeInTheDocument()
  })

  it('three entries for one metric show correct trend sequence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '100')
    await addEntry(u, 'Weight', '110')
    await addEntry(u, 'Weight', '105')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
    expect(within(items[1]).getByText('▲')).toBeInTheDocument()
    expect(within(items[2]).getByText('▼')).toBeInTheDocument()
  })

  it('clear all then re-add shows correct fresh state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Views', '1000')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByText('Entries: 0')).toBeInTheDocument()
    await addEntry(u, 'Views', '500')
    expect(screen.getByText('Entries: 1')).toBeInTheDocument()
    // first entry again, so trend is —
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Dashboard total entries reflects all entries including duplicates for same metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Ping', '10')
    await addEntry(u, 'Ping', '12')
    await addEntry(u, 'Ping', '11')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 1')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
  })
})
