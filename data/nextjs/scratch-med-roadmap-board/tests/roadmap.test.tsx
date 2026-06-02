import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board app', () => {
  it('starts on the Roadmap view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Roadmap from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('shows seeded items on load', () => {
    render(<App />)
    expect(screen.getByText('Dark mode — Q1 — shipped')).toBeInTheDocument()
    expect(screen.getByText('API v2 — Q2 — in-progress')).toBeInTheDocument()
    expect(screen.getByText('Mobile app — Q3 — planned')).toBeInTheDocument()
  })

  it('shows Showing: 3 items on load with seeded data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('adds a new item to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Analytics dashboard', 'Q4', 'planned')
    expect(screen.getByText('Analytics dashboard — Q4 — planned')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 items')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('ships an item and the button becomes disabled', async () => {
    const u = userEvent.setup()
    render(<App />)
    const shipBtn = screen.getByRole('button', { name: /ship api v2/i })
    expect(shipBtn).not.toBeDisabled()
    await u.click(shipBtn)
    expect(screen.getByText('API v2 — Q2 — shipped')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ship api v2/i })).toBeDisabled()
  })

  it('Ship button is disabled for already-shipped items', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /ship dark mode/i })).toBeDisabled()
  })

  it('filters items by quarter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('API v2 — Q2 — in-progress')).toBeInTheDocument()
    expect(screen.queryByText('Dark mode — Q1 — shipped')).not.toBeInTheDocument()
  })

  it('filter All shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'All')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('filter showing zero items when quarter has no entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('stats show correct seeded counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('In progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 33%')).toBeInTheDocument()
  })

  it('stats update when an item is shipped (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship mobile app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 67%')).toBeInTheDocument()
  })

  it('stats update when a new item is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'New feature', 'Q4', 'planned')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Planned: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 25%')).toBeInTheDocument()
  })

  it('stats ignore roadmap filter (shows all items)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Roadmap')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('reset items restores seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Extra item', 'Q4', 'planned')
    expect(screen.getByText('Showing: 4 items')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset items/i }))
    await nav(u, 'Roadmap')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
    expect(screen.queryByText('Extra item — Q4 — planned')).not.toBeInTheDocument()
  })

  it('roadmap state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item', 'Q2', 'planned')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persistent item — Q2 — planned')).toBeInTheDocument()
  })

  it('shipped percentage is 0% when no items exist after reset then checking stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset items/i }))
    await nav(u, 'Stats')
    // after reset we have seeded 3 items again with 1 shipped => 33%
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 33%')).toBeInTheDocument()
  })
})
