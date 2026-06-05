import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter = 'Q1', status = 'Planned') {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/i), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap app', () => {
  it('starts on the Roadmap view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
  })

  it('shows Items (0) initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
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

  it('adds an item and shows it with count 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Dark mode', 'Q2', 'Planned')
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('ignores a blank item title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
  })

  it('displays the quarter and status of an added item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'API v2', 'Q3', 'In Progress')
    const li = screen.getByText('API v2').closest('li') as HTMLElement
    expect(within(li).getByText('Q3')).toBeInTheDocument()
    expect(within(li).getByText('In Progress')).toBeInTheDocument()
  })

  it('ships an item using the Ship button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Export CSV', 'Q1', 'Planned')
    const li = screen.getByText('Export CSV').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /ship export csv/i }))
    expect(within(li).getByText('Shipped')).toBeInTheDocument()
  })

  it('disables the Ship button for already-shipped items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Auth flow', 'Q1', 'Shipped')
    const li = screen.getByText('Auth flow').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: /ship auth flow/i })).toBeDisabled()
  })

  it('filters items by quarter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Feature A', 'Q1', 'Planned')
    await addItem(u, 'Feature B', 'Q2', 'Planned')
    await addItem(u, 'Feature C', 'Q1', 'In Progress')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
    expect(screen.getByText('Feature A')).toBeInTheDocument()
    expect(screen.getByText('Feature C')).toBeInTheDocument()
    expect(screen.queryByText('Feature B')).not.toBeInTheDocument()
  })

  it('shows all items when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item X', 'Q1', 'Planned')
    await addItem(u, 'Item Y', 'Q4', 'Shipped')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'All')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('stats shows zeroes when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0%')).toBeInTheDocument()
  })

  it('stats reflects all items added on Roadmap view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Q1', 'Planned')
    await addItem(u, 'P2', 'Q2', 'In Progress')
    await addItem(u, 'P3', 'Q3', 'Shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Planned: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 33%')).toBeInTheDocument()
  })

  it('stats counts unfiltered items when a quarter filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', 'Q1', 'Shipped')
    await addItem(u, 'B', 'Q2', 'Shipped')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 100%')).toBeInTheDocument()
  })

  it('shipping an item updates Stats shipped count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deploy', 'Q2', 'Planned')
    const li = screen.getByText('Deploy').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /ship deploy/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 100%')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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

  it('reset all items clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To be cleared', 'Q1', 'Planned')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Roadmap')
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
    expect(screen.queryByText('To be cleared')).not.toBeInTheDocument()
  })

  it('reset all items resets stats too', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gone', 'Q3', 'Shipped')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 0%')).toBeInTheDocument()
  })

  it('keeps items when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item', 'Q2', 'In Progress')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })
})
