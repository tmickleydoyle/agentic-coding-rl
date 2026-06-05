import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(
  u: U,
  title: string,
  platform = 'Blog',
  status = 'draft'
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

  it('shows Showing: 0 items on empty list', () => {
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

  it('navigates back to Content view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByRole('heading', { name: 'Content' })).toBeInTheDocument()
  })

  it('adds an item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch post', 'Blog', 'draft')
    expect(screen.getByText('Launch post')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('clears the title input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Hello world')
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('shows platform and status on the item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Tweet thread', 'Twitter', 'scheduled')
    const li = screen.getByText('Tweet thread').closest('li') as HTMLElement
    expect(within(li).getByText('Twitter')).toBeInTheDocument()
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To delete', 'LinkedIn', 'published')
    await u.click(screen.getByRole('button', { name: /delete to delete/i }))
    expect(screen.queryByText('To delete')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('filters items by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft one', 'Blog', 'draft')
    await addItem(u, 'Scheduled one', 'Twitter', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Draft one')).toBeInTheDocument()
    expect(screen.queryByText('Scheduled one')).not.toBeInTheDocument()
  })

  it('filter all shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', 'Blog', 'draft')
    await addItem(u, 'B', 'Instagram', 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('stats shows Total: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('stats reflects added items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Post A', 'Blog', 'scheduled')
    await addItem(u, 'Post B', 'Twitter', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
  })

  it('computes scheduled rate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'S1', 'Blog', 'scheduled')
    await addItem(u, 'S2', 'Blog', 'scheduled')
    await addItem(u, 'D1', 'Blog', 'draft')
    await addItem(u, 'D2', 'Blog', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 50%')).toBeInTheDocument()
  })

  it('stats does not change when filter is applied on Content view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Filtered out', 'Blog', 'published')
    await addItem(u, 'Visible', 'Blog', 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Content')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item', 'LinkedIn', 'published')
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })

  it('adding a published item updates Published count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Published piece', 'Instagram', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })
})
