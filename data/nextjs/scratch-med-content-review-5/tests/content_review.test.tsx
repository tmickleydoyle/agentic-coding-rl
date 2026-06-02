import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.clear(screen.getByLabelText(/reviewer name/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.type(screen.getByLabelText(/reviewer name/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Review app', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows Showing 0 items initially', () => {
    render(<App />)
    expect(screen.getByText('Showing 0 items')).toBeInTheDocument()
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

  it('navigates back to Reviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('adds an item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Homepage copy', 'Alice')
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('new item has draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post', 'Bob')
    expect(within(itemRow('Blog post')).getByText('draft')).toBeInTheDocument()
  })

  it('updates Showing count after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Article A', 'Alice')
    await addItem(u, 'Article B', 'Bob')
    expect(screen.getByText('Showing 2 items')).toBeInTheDocument()
  })

  it('ignores add when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/reviewer name/i), 'Alice')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing 0 items')).toBeInTheDocument()
  })

  it('ignores add when reviewer is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item title/i), 'Some title')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing 0 items')).toBeInTheDocument()
  })

  it('sets item status to approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Landing page', 'Carol')
    await u.click(within(itemRow('Landing page')).getByRole('button', { name: /set approved/i }))
    expect(within(itemRow('Landing page')).getByText('approved')).toBeInTheDocument()
  })

  it('sets item status to changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'FAQ page', 'Dave')
    await u.click(within(itemRow('FAQ page')).getByRole('button', { name: /set changes/i }))
    expect(within(itemRow('FAQ page')).getByText('changes')).toBeInTheDocument()
  })

  it('sets item status back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'About us', 'Eve')
    await u.click(within(itemRow('About us')).getByRole('button', { name: /set approved/i }))
    await u.click(within(itemRow('About us')).getByRole('button', { name: /set draft/i }))
    expect(within(itemRow('About us')).getByText('draft')).toBeInTheDocument()
  })

  it('filter by Approved shows only approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post X', 'Alice')
    await addItem(u, 'Post Y', 'Bob')
    await u.click(within(itemRow('Post X')).getByRole('button', { name: /set approved/i }))
    await u.click(screen.getByRole('button', { name: 'Approved' }))
    expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
    expect(screen.getByText('Post X')).toBeInTheDocument()
    expect(screen.queryByText('Post Y')).not.toBeInTheDocument()
  })

  it('filter by Draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft one', 'Alice')
    await addItem(u, 'Approved one', 'Bob')
    await u.click(within(itemRow('Approved one')).getByRole('button', { name: /set approved/i }))
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    expect(screen.getByText('Showing 1 items')).toBeInTheDocument()
    expect(screen.getByText('Draft one')).toBeInTheDocument()
    expect(screen.queryByText('Approved one')).not.toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', 'Alice')
    await addItem(u, 'Item 2', 'Bob')
    await u.click(screen.getByRole('button', { name: 'Draft' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing 2 items')).toBeInTheDocument()
  })

  it('Stats shows 0% approved with no items (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('Stats reflects items added on Reviews (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spec doc', 'Alice')
    await addItem(u, 'Design doc', 'Bob')
    await u.click(within(itemRow('Spec doc')).getByRole('button', { name: /set approved/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 50%')).toBeInTheDocument()
  })

  it('Stats shows Changes count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Review me', 'Carol')
    await u.click(within(itemRow('Review me')).getByRole('button', { name: /set changes/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Changes: 1')).toBeInTheDocument()
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

  it('Clear all items removes everything (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To be cleared', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Reviews')
    expect(screen.getByText('Showing 0 items')).toBeInTheDocument()
    expect(screen.queryByText('To be cleared')).not.toBeInTheDocument()
  })

  it('Stats resets after clearing all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gone item', 'Bob')
    await u.click(within(itemRow('Gone item')).getByRole('button', { name: /set approved/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('preserves list state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item', 'Alice')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
  })
})
