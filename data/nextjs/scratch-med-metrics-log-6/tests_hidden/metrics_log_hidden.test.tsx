// HELD-OUT generalization tests — fresh scenarios and cross-view paths.
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

describe('Metrics Log (held-out)', () => {
  it('trend updates to rising after third entry increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Conversion', '10')
    await addEntry(u, 'Conversion', '8')
    // currently falling; add a higher value
    await addEntry(u, 'Conversion', '15')
    const rows = screen.getAllByRole('row')
    const dataRow = rows.find((r) => within(r).queryByText('Conversion'))
    expect(within(dataRow!).getByText('▲')).toBeInTheDocument()
    expect(within(dataRow!).getByText('15')).toBeInTheDocument()
  })

  it('deleting a metric reduces total entries on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'PageViews', '300')
    await addEntry(u, 'PageViews', '400')
    await addEntry(u, 'Bounces', '50')
    // delete PageViews (2 entries)
    await u.click(screen.getByRole('button', { name: 'Delete PageViews' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    expect(screen.getByText('Distinct metrics: 1')).toBeInTheDocument()
  })

  it('stable metric with no prior entry is counted in Stable on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Solo', '99')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Stable: 1')).toBeInTheDocument()
    expect(screen.getByText('Rising: 0')).toBeInTheDocument()
    expect(screen.getByText('Falling: 0')).toBeInTheDocument()
  })

  it('negative value entries work correctly for trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '-5')
    await addEntry(u, 'Temp', '-10')
    const rows = screen.getAllByRole('row')
    const dataRow = rows.find((r) => within(r).queryByText('Temp'))
    expect(within(dataRow!).getByText('▼')).toBeInTheDocument()
    expect(within(dataRow!).getByText('-10')).toBeInTheDocument()
  })

  it('after clear all, adding new entries works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'OldMetric', '1000')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    await addEntry(u, 'NewMetric', '5')
    expect(screen.getByText('Metrics tracked: 1')).toBeInTheDocument()
    expect(screen.getByText('NewMetric')).toBeInTheDocument()
    expect(screen.queryByText('OldMetric')).not.toBeInTheDocument()
  })

  it('dashboard Stable counts metric with equal consecutive values', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'NPS', '42')
    await addEntry(u, 'NPS', '42')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Stable: 1')).toBeInTheDocument()
    expect(screen.getByText('Rising: 0')).toBeInTheDocument()
  })

  it('multiple deletes bring Metrics tracked to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '1')
    await addEntry(u, 'Beta', '2')
    await u.click(screen.getByRole('button', { name: 'Delete Alpha' }))
    await u.click(screen.getByRole('button', { name: 'Delete Beta' }))
    expect(screen.getByText('Metrics tracked: 0')).toBeInTheDocument()
  })

  it('decimal values are accepted and shown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Rate', '3.14')
    expect(screen.getByText('Rate')).toBeInTheDocument()
    expect(screen.getByText('3.14')).toBeInTheDocument()
  })

  it('dashboard total entries grows with each add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    await nav(u, 'Log')
    await addEntry(u, 'X', '2')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
  })

  it('theme toggle from light to dark shows current theme in button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })
})
