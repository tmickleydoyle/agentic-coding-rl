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

describe('Metrics Logger app', () => {
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

  it('navigates back to Log view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByRole('heading', { name: 'Log' })).toBeInTheDocument()
  })

  it('adds an entry and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72')
    expect(screen.getByText(/\#1 Weight: 72/)).toBeInTheDocument()
  })

  it('ignores blank metric name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric value/i), '50')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
  })

  it('ignores blank metric value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/metric name/i), 'Weight')
    await u.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
  })

  it('shows — trend for first entry of a metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '5000')
    const li = screen.getByText(/\#1 Steps: 5000/).closest('li') as HTMLElement
    expect(within(li).getByText('—')).toBeInTheDocument()
  })

  it('shows ▲ trend when value increases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '5000')
    await addEntry(u, 'Steps', '8000')
    const li = screen.getByText(/\#2 Steps: 8000/).closest('li') as HTMLElement
    expect(within(li).getByText('▲')).toBeInTheDocument()
  })

  it('shows ▼ trend when value decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '80')
    await addEntry(u, 'Weight', '75')
    const li = screen.getByText(/\#2 Weight: 75/).closest('li') as HTMLElement
    expect(within(li).getByText('▼')).toBeInTheDocument()
  })

  it('shows — trend when value is equal to previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Pulse', '60')
    await addEntry(u, 'Pulse', '60')
    const li = screen.getByText(/\#2 Pulse: 60/).closest('li') as HTMLElement
    expect(within(li).getAllByText('—').length).toBeGreaterThan(0)
  })

  it('shows Clear all button only when entries exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
    await addEntry(u, 'HR', '70')
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
  })

  it('clears all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'HR', '70')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryByText(/\#1 HR: 70/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
  })

  it('Dashboard shows No entries yet when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('No entries yet')).toBeInTheDocument()
  })

  it('Dashboard shows total entries count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72')
    await addEntry(u, 'Steps', '8000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
  })

  it('Dashboard shows tracked metrics count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72')
    await addEntry(u, 'Steps', '8000')
    await addEntry(u, 'Weight', '74')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Tracked metrics: 2')).toBeInTheDocument()
  })

  it('Dashboard shows latest value and trend for each metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Weight', '72')
    await addEntry(u, 'Weight', '74')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Weight: 74 ▲')).toBeInTheDocument()
  })

  it('Dashboard shows — trend for single-entry metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '37')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Temp: 37 —')).toBeInTheDocument()
  })

  it('cross-view: entries added in Log appear in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '10000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
    expect(screen.getByText('Steps: 10000 —')).toBeInTheDocument()
  })

  it('settings theme toggle changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
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

  it('Filter low values hides entries below 10 in Log', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '5')
    await addEntry(u, 'Score', '15')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter low values/i))
    await nav(u, 'Log')
    expect(screen.queryByText(/\#1 Score: 5/)).not.toBeInTheDocument()
    expect(screen.getByText(/\#2 Score: 15/)).toBeInTheDocument()
  })

  it('Filter low values: filtered entries still count in Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Score', '5')
    await addEntry(u, 'Score', '15')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter low values/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 2')).toBeInTheDocument()
  })

  it('state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'HR', '65')
    await nav(u, 'Dashboard')
    await nav(u, 'Log')
    expect(screen.getByText(/\#1 HR: 65/)).toBeInTheDocument()
  })
})
