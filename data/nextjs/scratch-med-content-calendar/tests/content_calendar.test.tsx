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
  it('starts on the Calendar view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
  })

  it('shows three seeded posts on load', () => {
    render(<App />)
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.getByText('Product demo')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('shows Showing: 3 posts on initial load', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 posts')).toBeInTheDocument()
  })

  it('shows Scheduled: 1 on initial load', () => {
    render(<App />)
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
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

  it('navigates back to Calendar after visiting Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
  })

  it('adds a new post and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New blog post', 'Blog', 'Draft')
    expect(screen.getByText('New blog post')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add post/i }))
    expect(screen.getByText('Showing: 3 posts')).toBeInTheDocument()
  })

  it('updates Showing count after adding a post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Extra post', 'LinkedIn', 'Draft')
    expect(screen.getByText('Showing: 4 posts')).toBeInTheDocument()
  })

  it('updates Scheduled count after adding a scheduled post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Planned tweet', 'Twitter', 'Scheduled')
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
  })

  it('deletes a post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Behind the scenes' }))
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 posts')).toBeInTheDocument()
  })

  it('filters posts by Scheduled status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Scheduled')
    expect(screen.getByText('Showing: 1 posts')).toBeInTheDocument()
    expect(screen.getByText('Product demo')).toBeInTheDocument()
    expect(screen.queryByText('Launch announcement')).not.toBeInTheDocument()
  })

  it('filters posts by Draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Showing: 1 posts')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('filter does not affect the Scheduled count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Published')
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
  })

  it('stats view shows correct initial totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('stats view shows correct publish rate with seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Publish rate: 33%')).toBeInTheDocument()
  })

  it('stats view updates after adding a published post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Promo article', 'Blog', 'Published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 4')).toBeInTheDocument()
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
    expect(screen.getByText('Publish rate: 50%')).toBeInTheDocument()
  })

  it('stats view shows 0% publish rate when no posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Launch announcement' }))
    await u.click(screen.getByRole('button', { name: 'Delete Product demo' }))
    await u.click(screen.getByRole('button', { name: 'Delete Behind the scenes' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 0')).toBeInTheDocument()
    expect(screen.getByText('Publish rate: 0%')).toBeInTheDocument()
  })

  it('toggles the theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Calendar')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('calendar state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Persistent post', 'Instagram', 'Draft')
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    expect(screen.getByText('Persistent post')).toBeInTheDocument()
  })

  it('resetting filter to All shows all posts again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Published')
    expect(screen.getByText('Showing: 1 posts')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 3 posts')).toBeInTheDocument()
  })
})
