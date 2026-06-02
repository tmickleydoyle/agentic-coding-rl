import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addPost(u: U, title: string, platform = 'Twitter', status = 'draft') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add post/i }))
}

describe('Content Calendar app', () => {
  it('starts on the Posts view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument()
  })

  it('seeds with 3 posts and shows Posts (3) heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Posts (3)' })).toBeInTheDocument()
  })

  it('seed posts appear in the list', () => {
    render(<App />)
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
    expect(screen.getByText('Case study')).toBeInTheDocument()
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

  it('navigates back to Posts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Posts')
    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument()
  })

  it('adds a new post and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New campaign', 'LinkedIn', 'scheduled')
    expect(screen.getByRole('heading', { name: 'Posts (4)' })).toBeInTheDocument()
    expect(screen.getByText('New campaign')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add post/i }))
    expect(screen.getByRole('heading', { name: 'Posts (3)' })).toBeInTheDocument()
  })

  it('deletes a post and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    expect(screen.getByRole('heading', { name: 'Posts (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Launch announcement')).not.toBeInTheDocument()
  })

  it('filters by draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByRole('heading', { name: 'Posts (1)' })).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
    expect(screen.queryByText('Launch announcement')).not.toBeInTheDocument()
  })

  it('filters by scheduled status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByRole('heading', { name: 'Posts (1)' })).toBeInTheDocument()
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
  })

  it('filters by published status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByRole('heading', { name: 'Posts (1)' })).toBeInTheDocument()
    expect(screen.getByText('Case study')).toBeInTheDocument()
  })

  it('All filter restores the full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Posts (3)' })).toBeInTheDocument()
  })

  it('Stats shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('Stats shows Scheduled %: 33% for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled %: 33%')).toBeInTheDocument()
  })

  it('Stats updates after adding a scheduled post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Product launch', 'Twitter', 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
    expect(screen.getByText('Scheduled %: 50%')).toBeInTheDocument()
  })

  it('Stats updates after deleting a post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete case study/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
  })

  it('Stats shows 0% when there are no posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    await u.click(screen.getByRole('button', { name: /delete behind the scenes/i }))
    await u.click(screen.getByRole('button', { name: /delete case study/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled %: 0%')).toBeInTheDocument()
  })

  it('Stats counts ignore the active filter on Posts view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('toggles theme to dark and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Posts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('post list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Persistent post', 'Instagram', 'draft')
    await nav(u, 'Stats')
    await nav(u, 'Posts')
    expect(screen.getByText('Persistent post')).toBeInTheDocument()
  })
})
