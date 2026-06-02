// HELD-OUT generalization tests — different inputs and sequences than the visible suite.
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
  it('dashboard updates after clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Pageviews', '500')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No entries yet')).toBeInTheDocument()
  })

  it('trend resets after clear all and re-entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Clicks', '10')
    await addEntry(u, 'Clicks', '20')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'Clicks', '15')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('—')).toBeInTheDocument()
  })

  it('three entries for same metric: middle shows ↑, latest shows ↓', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '20')
    await addEntry(u, 'Temp', '30')
    await addEntry(u, 'Temp', '25')
    const items = screen.getAllByRole('listitem')
    // newest first
    expect(within(items[0]).getByText('↓')).toBeInTheDocument()
    expect(within(items[1]).getByText('↑')).toBeInTheDocument()
    expect(within(items[2]).getByText('—')).toBeInTheDocument()
  })

  it('dashboard lists metrics in first-logged order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zebra', '1')
    await addEntry(u, 'Apple', '2')
    await addEntry(u, 'Mango', '3')
    await nav(u, 'Dashboard')
    const paragraphs = screen.getAllByText(/latest=/)
    expect(paragraphs[0]).toHaveTextContent('Zebra')
    expect(paragraphs[1]).toHaveTextContent('Apple')
    expect(paragraphs[2]).toHaveTextContent('Mango')
  })

  it('dashboard shows correct latest when entries interleaved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '10')
    await addEntry(u, 'Memory', '512')
    await addEntry(u, 'Load', '15')
    await addEntry(u, 'Memory', '480')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Load: latest=15 trend=↑')).toBeInTheDocument()
    expect(screen.getByText('Memory: latest=480 trend=↓')).toBeInTheDocument()
  })

  it('show all off then on restores all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '1000')
    await addEntry(u, 'Steps', '2000')
    await addEntry(u, 'Steps', '1500')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i)) // off
    await u.click(screen.getByLabelText(/show all entries/i)) // on again
    await nav(u, 'Log')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('total entries on dashboard counts all even when show-all is off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Rate', '5')
    await addEntry(u, 'Rate', '7')
    await addEntry(u, 'Rate', '6')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show all entries/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total entries: 3')).toBeInTheDocument()
  })

  it('theme toggles to dark and back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('zero value is accepted as a valid entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Failures', '0')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(within(items[0]).getByText('0')).toBeInTheDocument()
  })

  it('negative value is accepted and trend works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Delta', '-5')
    await addEntry(u, 'Delta', '-3')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('↑')).toBeInTheDocument()
  })

  it('unique metrics count updates after clear and re-add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addEntry(u, 'C', '3')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Unique metrics: 1')).toBeInTheDocument()
    expect(screen.getByText('Total entries: 1')).toBeInTheDocument()
  })
})
