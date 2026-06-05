import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText(/metric name/i))
  await u.clear(screen.getByLabelText(/^value$/i))
  await u.type(screen.getByLabelText(/metric name/i), name)
  await u.type(screen.getByLabelText(/^value$/i), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Log app', () => {
  it('starts on the Log view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('shows empty entries heading on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /entries \(0\)/i })).toBeInTheDocument()
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

  it('adds an entry and shows it formatted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72.5')
    expect(screen.getByText('#1 Weight: 72.50')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /entries \(1\)/i })).toBeInTheDocument()
  })

  it('adds multiple entries and increments count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Weight', '71')
    await addEntry(u, 'Steps', '8000')
    expect(screen.getByRole('heading', { name: /entries \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('#1 Weight: 70.00')).toBeInTheDocument()
    expect(screen.getByText('#2 Weight: 71.00')).toBeInTheDocument()
    expect(screen.getByText('#3 Steps: 8000.00')).toBeInTheDocument()
  })

  it('ignores entry with blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^value$/i), '99')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByRole('heading', { name: /entries \(0\)/i })).toBeInTheDocument()
  })

  it('ignores entry with blank value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Weight')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByRole('heading', { name: /entries \(0\)/i })).toBeInTheDocument()
  })

  it('ignores entry with non-numeric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', 'abc')
    expect(screen.getByRole('heading', { name: /entries \(0\)/i })).toBeInTheDocument()
  })

  it('deletes an entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72')
    await addEntry(u, 'Steps', '5000')
    await u.click(screen.getByRole('button', { name: /delete entry 1/i }))
    expect(screen.getByRole('heading', { name: /entries \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText(/weight/i)).not.toBeInTheDocument()
  })

  it('shows no metrics message on dashboard when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet.')).toBeInTheDocument()
  })

  it('shows latest value on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Weight', '72')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Latest: 72.00')).toBeInTheDocument()
  })

  it('shows trend up when latest is higher', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Weight', '75')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Trend: up')).toBeInTheDocument()
  })

  it('shows trend down when latest is lower', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '9000')
    await addEntry(u, 'Steps', '7000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Trend: down')).toBeInTheDocument()
  })

  it('shows trend flat when only one entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Trend: flat')).toBeInTheDocument()
  })

  it('shows trend flat when latest equals previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Weight', '70')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Trend: flat')).toBeInTheDocument()
  })

  it('shows correct count per metric on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Weight', '71')
    await addEntry(u, 'Weight', '72')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Count: 3')).toBeInTheDocument()
  })

  it('dashboard shows multiple metrics in order of first appearance', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Steps', '8000')
    await nav(u, 'Dashboard')
    const headings = screen.getAllByRole('heading', { level: 2 })
    const names = headings.map((h) => h.textContent)
    expect(names.indexOf('Weight')).toBeLessThan(names.indexOf('Steps'))
  })

  it('clears all entries via Settings (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await addEntry(u, 'Steps', '8000')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: /entries \(0\)/i })).toBeInTheDocument()
  })

  it('dashboard shows no metrics after clearing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '70')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No metrics logged yet.')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
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

  it('log state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Calories', '2000')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText('#1 Calories: 2000.00')).toBeInTheDocument()
  })
})
