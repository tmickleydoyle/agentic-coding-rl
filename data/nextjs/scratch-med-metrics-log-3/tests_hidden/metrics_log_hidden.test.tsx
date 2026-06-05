// Held-out generalization tests — overlaid only at eval.
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
  it('dashboard unique metrics count reflects distinct names only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'DAU', '100')
    await addEntry(u, 'DAU', '120')
    await addEntry(u, 'DAU', '110')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique metrics: 1')).toBeInTheDocument()
  })

  it('dashboard shows down trend after three entries where last is lowest', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Churn', '15')
    await addEntry(u, 'Churn', '20')
    await addEntry(u, 'Churn', '12')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Churn: 12 ↓')).toBeInTheDocument()
  })

  it('Clear all then re-add shows fresh entry with no trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'MRR', '200')
    await addEntry(u, 'MRR', '250')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'MRR', '300')
    expect(screen.getByText('MRR: 300')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
  })

  it('Reset log then dashboard shows zero unique metrics', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'CAC', '40')
    await addEntry(u, 'LTV', '120')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset log/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Unique metrics: 0')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('dashboard lists metrics in first-appearance order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zebra', '1')
    await addEntry(u, 'Apple', '2')
    await addEntry(u, 'Mango', '3')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toContain('Zebra')
    expect(items[1].textContent).toContain('Apple')
    expect(items[2].textContent).toContain('Mango')
  })

  it('flat trend shown when two equal consecutive values for same metric in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'NPS', '55')
    await addEntry(u, 'NPS', '55')
    await nav(u, 'Dashboard')
    expect(screen.getByText('NPS: 55 →')).toBeInTheDocument()
  })

  it('log shows multiple metrics independently without cross-contamination', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'P1', '10')
    await addEntry(u, 'P2', '100')
    await addEntry(u, 'P1', '20')
    const items = screen.getAllByRole('listitem')
    // P2 still has no trend (only one entry)
    expect(items[1].textContent).toBe('P2: 100')
    // P1 latest shows up
    expect(items[2].textContent).toBe('P1: 20 ↑')
  })

  it('theme toggle button reflects current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('adds entry with negative numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Delta', '-5')
    expect(screen.getByText('Delta: -5')).toBeInTheDocument()
  })

  it('negative to less negative shows up trend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '-10')
    await addEntry(u, 'Temp', '-3')
    const items = screen.getAllByRole('listitem')
    expect(items[1].textContent).toBe('Temp: -3 ↑')
  })
})
