import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'planned') {
  await u.clear(screen.getByLabelText('Item title'))
  await u.type(screen.getByLabelText('Item title'), title)
  await u.selectOptions(screen.getByLabelText('Quarter'), quarter)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap Board app', () => {
  it('starts on the Roadmap view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('shows Showing: 0 items initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
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

  it('adds a roadmap item and shows it', async () => {
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

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Remove me', 'Q1', 'planned')
    expect(screen.getByText('Remove me')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Remove me' }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('marks an item as shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Ship feature', 'Q3', 'in-progress')
    await u.click(screen.getByRole('button', { name: 'Mark shipped Ship feature' }))
    const li = screen.getByText('Ship feature').closest('li') as HTMLElement
    expect(within(li).getByText('shipped')).toBeInTheDocument()
  })

  it('disables Mark shipped for already-shipped items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done item', 'Q1', 'shipped')
    expect(screen.getByRole('button', { name: 'Mark shipped Done item' })).toBeDisabled()
  })

  it('filters items by quarter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1 task', 'Q1', 'planned')
    await addItem(u, 'Q3 task', 'Q3', 'planned')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'Q1')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Q1 task')).toBeInTheDocument()
    expect(screen.queryByText('Q3 task')).not.toBeInTheDocument()
  })

  it('filter All shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Q1', 'planned')
    await addItem(u, 'Beta', 'Q2', 'planned')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'Q2')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'All')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('stats view shows zeros with no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 0%')).toBeInTheDocument()
  })

  it('stats view reflects added items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Feature A', 'Q1', 'planned')
    await addItem(u, 'Feature B', 'Q2', 'in-progress')
    await addItem(u, 'Feature C', 'Q3', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 33%')).toBeInTheDocument()
  })

  it('marking shipped updates stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', 'Q1', 'planned')
    await addItem(u, 'Y', 'Q1', 'planned')
    await u.click(screen.getByRole('button', { name: 'Mark shipped X' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 50%')).toBeInTheDocument()
  })

  it('deleting an item is reflected in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp', 'Q2', 'shipped')
    await addItem(u, 'Keep', 'Q3', 'planned')
    await u.click(screen.getByRole('button', { name: 'Delete Temp' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 0%')).toBeInTheDocument()
  })

  it('filter does not affect stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Q1', 'shipped')
    await addItem(u, 'P2', 'Q2', 'shipped')
    await u.selectOptions(screen.getByLabelText('Filter by quarter'), 'Q1')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped %: 100%')).toBeInTheDocument()
  })

  it('toggles theme via data-theme attribute', async () => {
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
    await nav(u, 'Roadmap')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('roadmap state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent', 'Q4', 'planned')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })

  it('each item row shows quarter and status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Milestone', 'Q4', 'in-progress')
    const li = screen.getByText('Milestone').closest('li') as HTMLElement
    expect(within(li).getByText('Q4')).toBeInTheDocument()
    expect(within(li).getByText('in-progress')).toBeInTheDocument()
  })
})
