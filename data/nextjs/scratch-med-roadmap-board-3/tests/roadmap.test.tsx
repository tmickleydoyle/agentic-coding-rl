import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board app', () => {
  it('starts on the Roadmap view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('shows zero counts on empty state', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
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

  it('navigates back to Roadmap view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('adds an item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch beta', 'Q2', 'planned')
    expect(screen.getByText('Launch beta')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('shows item quarter and status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'API redesign', 'Q3', 'in-progress')
    const li = screen.getByText('API redesign').closest('li') as HTMLElement
    expect(within(li).getByText('Q3')).toBeInTheDocument()
    expect(within(li).getByText('in-progress')).toBeInTheDocument()
  })

  it('ships an item via Ship it button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Dark mode', 'Q1', 'planned')
    await u.click(screen.getByRole('button', { name: /ship it dark mode/i }))
    const li = screen.getByText('Dark mode').closest('li') as HTMLElement
    expect(within(li).getByText('shipped')).toBeInTheDocument()
  })

  it('disables Ship it button for already-shipped items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Shipped thing', 'Q4', 'shipped')
    expect(screen.getByRole('button', { name: /ship it shipped thing/i })).toBeDisabled()
  })

  it('updates shipped count when an item is shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Feature A', 'Q1', 'planned')
    await addItem(u, 'Feature B', 'Q1', 'planned')
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /ship it feature a/i }))
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('filters items by quarter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1 item', 'Q1', 'planned')
    await addItem(u, 'Q2 item', 'Q2', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Q1 item')).toBeInTheDocument()
    expect(screen.queryByText('Q2 item')).not.toBeInTheDocument()
  })

  it('shows all items when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item X', 'Q1', 'planned')
    await addItem(u, 'Item Y', 'Q3', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'All')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('shipped count respects the quarter filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1 ship', 'Q1', 'planned')
    await addItem(u, 'Q2 ship', 'Q2', 'planned')
    await u.click(screen.getByRole('button', { name: /ship it q1 ship/i }))
    await u.click(screen.getByRole('button', { name: /ship it q2 ship/i }))
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
  })

  it('stats view shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Plan A', 'Q1', 'planned')
    await addItem(u, 'WIP B', 'Q2', 'in-progress')
    await addItem(u, 'Done C', 'Q3', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 33%')).toBeInTheDocument()
  })

  it('stats reflect 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 0%')).toBeInTheDocument()
  })

  it('stats show 100% when all items are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Only item', 'Q1', 'planned')
    await u.click(screen.getByRole('button', { name: /ship it only item/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
  })

  it('stats are not affected by the quarter filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Q1', 'planned')
    await addItem(u, 'Beta', 'Q2', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('theme toggles via Settings and persists data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Roadmap')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item', 'Q4', 'planned')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('shipping an item updates stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Will ship', 'Q2', 'in-progress')
    await u.click(screen.getByRole('button', { name: /ship it will ship/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
  })
})
