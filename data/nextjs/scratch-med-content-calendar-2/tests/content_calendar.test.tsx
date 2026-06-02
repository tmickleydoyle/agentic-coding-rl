import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(
  u: U,
  title: string,
  platform = 'Twitter',
  status = 'draft',
) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Content Calendar app', () => {
  it('starts on the Content view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Content' })).toBeInTheDocument()
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

  it('navigates back to Content view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByRole('heading', { name: 'Content' })).toBeInTheDocument()
  })

  it('adds a content item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'My first post', 'Instagram', 'scheduled')
    expect(screen.getByText('My first post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
  })

  it('clears the title input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Cleared title')
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Delete me')
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
  })

  it('cycles status from draft to scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Cycle test', 'Twitter', 'draft')
    const li = screen.getByText('Cycle test').closest('li') as HTMLElement
    expect(within(li).getByText('draft')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: /change status/i }))
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
  })

  it('cycles status from scheduled to published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Publish me', 'Blog', 'scheduled')
    const li = screen.getByText('Publish me').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /change status/i }))
    expect(within(li).getByText('published')).toBeInTheDocument()
  })

  it('cycles status from published back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Round trip', 'LinkedIn', 'published')
    const li = screen.getByText('Round trip').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /change status/i }))
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('filter by scheduled hides non-scheduled items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft post', 'Twitter', 'draft')
    await addItem(u, 'Scheduled post', 'Instagram', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.queryByText('Draft post')).not.toBeInTheDocument()
    expect(screen.getByText('Scheduled post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('filter by all shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post A', 'Twitter', 'draft')
    await addItem(u, 'Post B', 'Blog', 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Post A')).toBeInTheDocument()
    expect(screen.getByText('Post B')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('stats shows zero totals initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('stats reflects added items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', 'Twitter', 'draft')
    await addItem(u, 'Item 2', 'Instagram', 'scheduled')
    await addItem(u, 'Item 3', 'Blog', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('scheduled rate is calculated correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'S1', 'Twitter', 'scheduled')
    await addItem(u, 'S2', 'Twitter', 'scheduled')
    await addItem(u, 'D1', 'Twitter', 'draft')
    await addItem(u, 'D2', 'Twitter', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 50%')).toBeInTheDocument()
  })

  it('stats counts all items even when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Filtered out', 'Twitter', 'draft')
    await addItem(u, 'Visible', 'Instagram', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Content')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('content list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent post', 'LinkedIn', 'draft')
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByText('Persistent post')).toBeInTheDocument()
  })

  it('shows platform for each item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'LinkedIn article', 'LinkedIn', 'draft')
    const li = screen.getByText('LinkedIn article').closest('li') as HTMLElement
    expect(within(li).getByText('LinkedIn')).toBeInTheDocument()
  })
})
