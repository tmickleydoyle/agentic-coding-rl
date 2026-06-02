import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Content Review Tracker', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
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

  it('shows the three seeded items on load', () => {
    render(<App />)
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Pricing page')).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
  })

  it('shows Items (3) with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('adds a new item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item title'), 'Blog post')
    await u.type(screen.getByLabelText('Reviewer'), 'Carol')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getByText('Blog post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (4)' })).toBeInTheDocument()
  })

  it('new item starts with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item title'), 'New article')
    await u.type(screen.getByLabelText('Reviewer'), 'Dave')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    const li = screen.getByText('New article').closest('li') as HTMLElement
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('ignores adding an item when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Reviewer'), 'Eve')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('ignores adding an item when reviewer is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item title'), 'Orphan')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.queryByText('Orphan')).not.toBeInTheDocument()
  })

  it('approves an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Pricing page').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Approve' }))
    expect(within(li).getByText('approved')).toBeInTheDocument()
  })

  it('requests changes on an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Pricing page').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Request changes' }))
    expect(within(li).getByText('changes')).toBeInTheDocument()
  })

  it('resets an item to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Homepage copy').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Reset to draft' }))
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('filters to show only approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'approved')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.queryByText('Pricing page')).not.toBeInTheDocument()
  })

  it('filters to show only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Pricing page')).toBeInTheDocument()
  })

  it('filters to show only changes items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'changes')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
  })

  it('returns to all items when filter is reset to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'approved')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('stats view shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 1')).toBeInTheDocument()
  })

  it('stats approval rate is 33% with seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Approval rate: 33%')).toBeInTheDocument()
  })

  it('stats update when an item is approved (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Pricing page').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Approve' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 2')).toBeInTheDocument()
    expect(screen.getByText('Approval rate: 67%')).toBeInTheDocument()
  })

  it('stats show 0% approval rate when no items are approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Homepage copy').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Reset to draft' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approval rate: 0%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item title'), 'Persistent item')
    await u.type(screen.getByLabelText('Reviewer'), 'Frank')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
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
  })
})
