import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

async function addItem(u: U, title: string, platform?: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  if (platform) {
    await u.selectOptions(screen.getByLabelText('Platform'), platform)
  }
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Content Calendar app', () => {
  it('starts on the Calendar view with seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByText('Launch post')).toBeInTheDocument()
    expect(screen.getByText('Product update')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Calendar')
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
  })

  it('shows Showing: 3 items initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('adds a new item as draft with correct platform', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'New blog post', 'Blog')
    expect(screen.getByText('New blog post')).toBeInTheDocument()
    const row = itemRow('New blog post')
    expect(within(row).getByText('Blog')).toBeInTheDocument()
    expect(within(row).getByText('draft')).toBeInTheDocument()
  })

  it('ignores blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('Showing count updates after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Extra post')
    expect(screen.getByText('Showing: 4 items')).toBeInTheDocument()
  })

  it('sets an item status to scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Behind the scenes')
    await u.click(within(row).getByRole('button', { name: /set scheduled/i }))
    expect(within(itemRow('Behind the scenes')).getByText('scheduled')).toBeInTheDocument()
  })

  it('sets an item status to published', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Behind the scenes')
    await u.click(within(row).getByRole('button', { name: /set published/i }))
    expect(within(itemRow('Behind the scenes')).getByText('published')).toBeInTheDocument()
  })

  it('sets an item status back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Launch post')
    await u.click(within(row).getByRole('button', { name: /set draft/i }))
    expect(within(itemRow('Launch post')).getByText('draft')).toBeInTheDocument()
  })

  it('filters by scheduled shows only scheduled items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Product update')).toBeInTheDocument()
    expect(screen.queryByText('Launch post')).not.toBeInTheDocument()
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
  })

  it('filters by draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
    expect(screen.queryByText('Launch post')).not.toBeInTheDocument()
  })

  it('filters by published shows only published items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Launch post')).toBeInTheDocument()
    expect(screen.queryByText('Product update')).not.toBeInTheDocument()
  })

  it('filter All shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('stats view shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('stats scheduled percentage with seed data is 33%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 33%')).toBeInTheDocument()
  })

  it('cross-view: changing status on Calendar updates Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Behind the scenes')
    await u.click(within(row).getByRole('button', { name: /set scheduled/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('cross-view: adding item on Calendar increases Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Weekly newsletter', 'Blog')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('stats percentage is 0% when all items have no scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Product update')).getByRole('button', { name: /set draft/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 0%')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Calendar')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item')
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })

  it('filter state resets do not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })
})
