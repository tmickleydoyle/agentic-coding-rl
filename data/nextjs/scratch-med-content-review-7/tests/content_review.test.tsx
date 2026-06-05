import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.clear(screen.getByLabelText(/reviewer/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.type(screen.getByLabelText(/reviewer/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review Tracker', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows Showing: 0 items on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('adds a review item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post draft', 'Alice')
    expect(screen.getByText('Blog post draft')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('new items start with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Landing page copy', 'Bob')
    expect(within(itemRow('Landing page copy')).getByText('draft')).toBeInTheDocument()
  })

  it('ignores add when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/reviewer/i), 'Alice')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('ignores add when reviewer is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item title/i), 'Some article')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('approves an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Newsletter', 'Carol')
    await u.click(within(itemRow('Newsletter')).getByRole('button', { name: /approve/i }))
    expect(within(itemRow('Newsletter')).getByText('approved')).toBeInTheDocument()
  })

  it('requests changes on an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Product page', 'Dan')
    await u.click(within(itemRow('Product page')).getByRole('button', { name: /request changes/i }))
    expect(within(itemRow('Product page')).getByText('changes')).toBeInTheDocument()
  })

  it('sets an item back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Press release', 'Eve')
    await u.click(within(itemRow('Press release')).getByRole('button', { name: /approve/i }))
    await u.click(within(itemRow('Press release')).getByRole('button', { name: /set draft/i }))
    expect(within(itemRow('Press release')).getByText('draft')).toBeInTheDocument()
  })

  it('filters to show only Draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Article A', 'Alice')
    await addItem(u, 'Article B', 'Bob')
    await u.click(within(itemRow('Article A')).getByRole('button', { name: /approve/i }))
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Article B')).toBeInTheDocument()
    expect(screen.queryByText('Article A')).not.toBeInTheDocument()
  })

  it('filters to show only Approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Report X', 'Alice')
    await addItem(u, 'Report Y', 'Bob')
    await u.click(within(itemRow('Report X')).getByRole('button', { name: /approve/i }))
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Report X')).toBeInTheDocument()
    expect(screen.queryByText('Report Y')).not.toBeInTheDocument()
  })

  it('filters to show only Changes items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spec doc', 'Carol')
    await addItem(u, 'API doc', 'Dan')
    await u.click(within(itemRow('Spec doc')).getByRole('button', { name: /request changes/i }))
    await u.click(screen.getByRole('button', { name: 'Changes' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Spec doc')).toBeInTheDocument()
    expect(screen.queryByText('API doc')).not.toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', 'Alice')
    await addItem(u, 'Item 2', 'Bob')
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post 1', 'Alice')
    await addItem(u, 'Post 2', 'Bob')
    await addItem(u, 'Post 3', 'Carol')
    await u.click(within(itemRow('Post 1')).getByRole('button', { name: /approve/i }))
    await u.click(within(itemRow('Post 2')).getByRole('button', { name: /request changes/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes: 1')).toBeInTheDocument()
  })

  it('Summary shows Approved: 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('Summary shows correct approved percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc A', 'Alice')
    await addItem(u, 'Doc B', 'Bob')
    await u.click(within(itemRow('Doc A')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Approved: 50%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all items removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To remove', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Reviews')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
    expect(screen.queryByText('To remove')).not.toBeInTheDocument()
  })

  it('Clear all items resets Summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp doc', 'Bob')
    await u.click(within(itemRow('Temp doc')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Sticky item', 'Eve')
    await nav(u, 'Summary')
    await nav(u, 'Reviews')
    expect(screen.getByText('Sticky item')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })
})
