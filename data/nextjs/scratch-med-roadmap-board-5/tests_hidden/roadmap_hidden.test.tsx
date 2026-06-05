// HELD-OUT generalization tests — different inputs, edge cases, cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter: string, status: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board (held-out)', () => {
  it('adding a shipped item immediately increments Stats Shipped count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Legacy cleanup', 'Q1', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
  })

  it('adding an in-progress item updates Stats In Progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Analytics v2', 'Q2', 'in-progress')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 2')).toBeInTheDocument()
  })

  it('filter Q4 with no Q4 items shows Showing: 0 items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('adding a Q4 item then filtering Q4 shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Year-end report', 'Q4', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Year-end report')).toBeInTheDocument()
  })

  it('shipping an item does not change the visible count when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship dashboard v2/i }))
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('Shipped counter on Roadmap reflects global shipped after shipping via Stats cross-check', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship api rate limiting/i }))
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('all three items shipped gives Ship rate: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship dashboard v2/i }))
    await u.click(screen.getByRole('button', { name: /ship api rate limiting/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Ship rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 3')).toBeInTheDocument()
  })

  it('Stats Planned decreases after shipping a planned item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship api rate limiting/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('theme toggle cycles light -> dark -> light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('items list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent feature', 'Q2', 'planned')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persistent feature')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 items')).toBeInTheDocument()
  })

  it('Q3 filter shows only API rate limiting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q3')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('API rate limiting')).toBeInTheDocument()
    expect(screen.queryByText('Mobile login')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard v2')).not.toBeInTheDocument()
  })
})
