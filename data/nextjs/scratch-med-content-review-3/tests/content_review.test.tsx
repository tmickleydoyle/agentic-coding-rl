import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.clear(screen.getByLabelText('Reviewer'))
  await u.type(screen.getByLabelText('Reviewer'), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Content Review Tracker', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('seeds three items on load', () => {
    render(<App />)
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.getByText('Pricing page')).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
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

  it('navigates back to Reviews from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
  })

  it('adds a new item in draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post', 'Carol')
    const row = itemRow('Blog post')
    expect(within(row).getByText('Carol')).toBeInTheDocument()
    expect(within(row).getByText('draft')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (4)' })).toBeInTheDocument()
  })

  it('ignores add when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Title'))
    await u.type(screen.getByLabelText('Reviewer'), 'Someone')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('ignores add when reviewer is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Some title')
    await u.clear(screen.getByLabelText('Reviewer'))
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('approves an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Homepage copy')
    await u.click(within(row).getByRole('button', { name: /approve/i }))
    expect(within(itemRow('Homepage copy')).getByText('approved')).toBeInTheDocument()
  })

  it('requests changes on an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Pricing page')
    await u.click(within(row).getByRole('button', { name: /request changes/i }))
    expect(within(itemRow('Pricing page')).getByText('changes')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('About us')
    await u.click(within(row).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('About us')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('filters by draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Homepage copy')).toBeInTheDocument()
    expect(screen.queryByText('Pricing page')).not.toBeInTheDocument()
  })

  it('filters by approved status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('Pricing page')).toBeInTheDocument()
  })

  it('filters by changes status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'changes')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
  })

  it('shows all items when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('Stats shows seeded data correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 33%')).toBeInTheDocument()
  })

  it('Stats updates when an item is approved (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /approve/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 67%')).toBeInTheDocument()
  })

  it('Stats updates when an item is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('Pricing page')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 0%')).toBeInTheDocument()
  })

  it('Stats shows 0% when no items remain', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const t of ['Homepage copy', 'Pricing page', 'About us']) {
      await u.click(within(itemRow(t)).getByRole('button', { name: /delete/i }))
    }
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

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('newly added item is included in Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Newsletter', 'Dave')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })
})
