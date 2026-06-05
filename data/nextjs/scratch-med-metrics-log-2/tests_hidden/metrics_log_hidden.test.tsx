// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view sequences.
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
  it('entry indices keep incrementing after a clear and re-add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'MRR', '1000')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'MRR', '2000')
    // index should be 2 because the counter does not reset with clear
    expect(screen.getByText('#2 — MRR: 2000')).toBeInTheDocument()
  })

  it('Dashboard disappears entries after Clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Churn', '5')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet')).toBeInTheDocument()
  })

  it('three entries same metric: Entries count is 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'NPS', '30')
    await addEntry(u, 'NPS', '45')
    await addEntry(u, 'NPS', '40')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric NPS' })
    expect(within(block).getByText('Entries: 3')).toBeInTheDocument()
    expect(within(block).getByText('Latest: 40')).toBeInTheDocument()
    expect(within(block).getByText('Trend: down')).toBeInTheDocument()
  })

  it('interleaved metrics: Dashboard shows independent trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sales', '200')
    await addEntry(u, 'Refunds', '10')
    await addEntry(u, 'Sales', '300')
    await addEntry(u, 'Refunds', '8')
    await nav(u, 'Dashboard')
    const sales = screen.getByRole('region', { name: 'Metric Sales' })
    expect(within(sales).getByText('Trend: up')).toBeInTheDocument()
    const refunds = screen.getByRole('region', { name: 'Metric Refunds' })
    expect(within(refunds).getByText('Trend: down')).toBeInTheDocument()
  })

  it('Show all entries off: only latest row per metric shows in Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CAC', '50')
    await addEntry(u, 'LTV', '300')
    await addEntry(u, 'CAC', '60')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i))
    await nav(u, 'Log')
    // #1 — CAC should be hidden, #3 — CAC should show
    expect(screen.queryByText('#1 — CAC: 50')).not.toBeInTheDocument()
    expect(screen.getByText('#3 — CAC: 60')).toBeInTheDocument()
    // LTV only has one entry, should still show
    expect(screen.getByText('#2 — LTV: 300')).toBeInTheDocument()
  })

  it('theme toggle persists when going Log -> Settings -> Dashboard -> Log', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('negative numeric value is accepted and shown correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Delta', '-15')
    expect(screen.getByText('#1 — Delta: -15')).toBeInTheDocument()
  })

  it('Dashboard shows Trend: up for negative-to-less-negative transition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Margin', '-50')
    await addEntry(u, 'Margin', '-20')
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Margin' })
    expect(within(block).getByText('Trend: up')).toBeInTheDocument()
  })

  it('decimal numeric value is accepted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Rate', '3.14')
    expect(screen.getByText('#1 — Rate: 3.14')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    const block = screen.getByRole('region', { name: 'Metric Rate' })
    expect(within(block).getByText('Latest: 3.14')).toBeInTheDocument()
  })
})
