import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addPost(u: U, title: string, platform: string, status: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add post/i }))
}

describe('Content Calendar app', () => {
  it('starts on the Posts view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument()
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

  it('shows seeded posts on load', () => {
    render(<App />)
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.getByText('Product demo')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('shows Scheduled count based on seeded data', () => {
    render(<App />)
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
  })

  it('adds a new post to the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New campaign', 'Instagram', 'scheduled')
    expect(screen.getByText('New campaign')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add post/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('updates Scheduled count when a scheduled post is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New campaign', 'Twitter', 'scheduled')
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
  })

  it('deletes a post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete behind the scenes/i }))
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
  })

  it('marks a post as published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark published product demo/i }))
    const li = screen.getByText('Product demo').closest('li') as HTMLElement
    expect(within(li).getByText('published')).toBeInTheDocument()
  })

  it('Mark Published button is disabled for already-published posts', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /mark published launch announcement/i })).toBeDisabled()
  })

  it('Mark Published button is enabled for scheduled posts', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /mark published product demo/i })).not.toBeDisabled()
  })

  it('filters posts by draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
    expect(screen.queryByText('Launch announcement')).not.toBeInTheDocument()
    expect(screen.queryByText('Product demo')).not.toBeInTheDocument()
  })

  it('filters posts by scheduled status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByText('Product demo')).toBeInTheDocument()
    expect(screen.queryByText('Launch announcement')).not.toBeInTheDocument()
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
  })

  it('Scheduled summary counts all posts even when filtered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
  })

  it('stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('stats view shows correct platform counts for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 1')).toBeInTheDocument()
    expect(screen.getByText('Instagram: 1')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn: 1')).toBeInTheDocument()
  })

  it('stats shows published rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Published rate: 33%')).toBeInTheDocument()
  })

  it('stats updates after adding a post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Extra post', 'Twitter', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 4')).toBeInTheDocument()
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
  })

  it('stats updates after marking a post published (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark published product demo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Persistent post', 'LinkedIn', 'draft')
    await nav(u, 'Stats')
    await nav(u, 'Posts')
    expect(screen.getByText('Persistent post')).toBeInTheDocument()
  })

  it('published rate is 0% when no posts exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    await u.click(screen.getByRole('button', { name: /delete product demo/i }))
    await u.click(screen.getByRole('button', { name: /delete behind the scenes/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 0')).toBeInTheDocument()
    expect(screen.getByText('Published rate: 0%')).toBeInTheDocument()
  })
})
