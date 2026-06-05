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
    expect(screen.getByRole('heading', { name: /content \(0\)/i })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /content/i })).toBeInTheDocument()
  })

  it('adds an item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch post')
    expect(screen.getByText('Launch post')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /content \(0\)/i })).toBeInTheDocument()
  })

  it('shows platform on item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Instagram reel', 'Instagram', 'draft')
    const li = screen.getByText('Instagram reel').closest('li') as HTMLElement
    expect(within(li).getByText('Instagram')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old tweet')
    await u.click(screen.getByRole('button', { name: /delete old tweet/i }))
    expect(screen.queryByText('Old tweet')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content \(0\)/i })).toBeInTheDocument()
  })

  it('changes status of an item inline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post', 'LinkedIn', 'draft')
    await u.selectOptions(screen.getByLabelText('Status for Blog post'), 'scheduled')
    const li = screen.getByText('Blog post').closest('li') as HTMLElement
    expect(within(li).getByRole('combobox', { name: /status for blog post/i })).toHaveValue('scheduled')
  })

  it('filters by draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft one', 'Twitter', 'draft')
    await addItem(u, 'Scheduled one', 'Twitter', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Draft one')).toBeInTheDocument()
    expect(screen.queryByText('Scheduled one')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content \(1\)/i })).toBeInTheDocument()
  })

  it('filters by scheduled status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post A', 'Twitter', 'scheduled')
    await addItem(u, 'Post B', 'Twitter', 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByText('Post A')).toBeInTheDocument()
    expect(screen.queryByText('Post B')).not.toBeInTheDocument()
  })

  it('filter all shows every item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', 'Twitter', 'draft')
    await addItem(u, 'Y', 'Instagram', 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: /content \(2\)/i })).toBeInTheDocument()
  })

  it('stats show zero totals when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('stats reflect added items (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Thread', 'Twitter', 'scheduled')
    await addItem(u, 'Story', 'Instagram', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 50%')).toBeInTheDocument()
  })

  it('stats count all items regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Twitter', 'published')
    await addItem(u, 'P2', 'Twitter', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
  })

  it('stats update when item status is changed inline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'My article', 'LinkedIn', 'draft')
    await u.selectOptions(screen.getByLabelText('Status for My article'), 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Content')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent post', 'LinkedIn', 'scheduled')
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByText('Persistent post')).toBeInTheDocument()
  })

  it('filter resets count correctly after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep', 'Twitter', 'draft')
    await addItem(u, 'Remove', 'Twitter', 'draft')
    await u.click(screen.getByRole('button', { name: /delete remove/i }))
    expect(screen.getByRole('heading', { name: /content \(1\)/i })).toBeInTheDocument()
  })

  it('scheduled rate rounds down correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', 'Twitter', 'scheduled')
    await addItem(u, 'B', 'Twitter', 'draft')
    await addItem(u, 'C', 'Instagram', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 33%')).toBeInTheDocument()
  })
})
