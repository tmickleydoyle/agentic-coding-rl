import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.clear(screen.getByLabelText(/reviewer/i))
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

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('shows Showing: 0 items initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('adds an item and shows it as draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Homepage copy', 'Alice')
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(within(itemRow('Homepage copy')).getByText('draft')).toBeInTheDocument()
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
    await u.type(screen.getByLabelText(/item title/i), 'Blog post')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('approves an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Landing page', 'Bob')
    await u.click(within(itemRow('Landing page')).getByRole('button', { name: 'Approve' }))
    expect(within(itemRow('Landing page')).getByText('approved')).toBeInTheDocument()
  })

  it('requests changes on an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'FAQ section', 'Carol')
    await u.click(within(itemRow('FAQ section')).getByRole('button', { name: 'Request changes' }))
    expect(within(itemRow('FAQ section')).getByText('changes')).toBeInTheDocument()
  })

  it('resets an item back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'About us', 'Dave')
    await u.click(within(itemRow('About us')).getByRole('button', { name: 'Approve' }))
    expect(within(itemRow('About us')).getByText('approved')).toBeInTheDocument()
    await u.click(within(itemRow('About us')).getByRole('button', { name: 'Reset to draft' }))
    expect(within(itemRow('About us')).getByText('draft')).toBeInTheDocument()
  })

  it('filter by approved shows only approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post A', 'Alice')
    await addItem(u, 'Post B', 'Bob')
    await u.click(within(itemRow('Post A')).getByRole('button', { name: 'Approve' }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Post A')).toBeInTheDocument()
    expect(screen.queryByText('Post B')).not.toBeInTheDocument()
  })

  it('filter by draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc X', 'Alice')
    await addItem(u, 'Doc Y', 'Bob')
    await u.click(within(itemRow('Doc X')).getByRole('button', { name: 'Approve' }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.queryByText('Doc X')).not.toBeInTheDocument()
    expect(screen.getByText('Doc Y')).toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', 'Alice')
    await addItem(u, 'Item 2', 'Bob')
    await u.click(within(itemRow('Item 1')).getByRole('button', { name: 'Approve' }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('Stats shows total and zeros initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 0%')).toBeInTheDocument()
  })

  it('Stats reflects cross-view state changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Story A', 'Alice')
    await addItem(u, 'Story B', 'Bob')
    await addItem(u, 'Story C', 'Carol')
    await u.click(within(itemRow('Story A')).getByRole('button', { name: 'Approve' }))
    await u.click(within(itemRow('Story B')).getByRole('button', { name: 'Request changes' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 33%')).toBeInTheDocument()
  })

  it('Stats approved % rounds to 50% for half approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', 'Alice')
    await addItem(u, 'Beta', 'Bob')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved %: 50%')).toBeInTheDocument()
  })

  it('Stats uses all items regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Alice')
    await addItem(u, 'P2', 'Bob')
    await u.click(within(itemRow('P1')).getByRole('button', { name: 'Approve' }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
  })

  it('Reset all items clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp', 'Alice')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Reviews')
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('Reset all items also clears Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'TempDoc', 'Alice')
    await u.click(within(itemRow('TempDoc')).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all items/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('reviewer name is shown in the item row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Newsletter', 'Grace')
    expect(within(itemRow('Newsletter')).getByText('Grace')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Sticky item', 'Hank')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Sticky item')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })
})
