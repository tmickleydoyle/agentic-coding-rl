import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addPost(u: U, title: string, platform?: string, status?: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  if (platform) await u.selectOptions(screen.getByLabelText('Platform'), platform)
  if (status) await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add post/i }))
}

describe('Content Calendar app', () => {
  it('starts on the Posts view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument()
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.getByText('Case study')).toBeInTheDocument()
    expect(screen.getByText('Product photo')).toBeInTheDocument()
  })

  it('shows seeded Showing count', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 post(s)')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument()
  })

  it('adds a new post and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New blog post', 'LinkedIn', 'draft')
    expect(screen.getByText('New blog post')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 post(s)')).toBeInTheDocument()
  })

  it('ignores a blank post title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add post/i }))
    expect(screen.getByText('Showing: 3 post(s)')).toBeInTheDocument()
  })

  it('deletes a post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Case study' }))
    expect(screen.queryByText('Case study')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 post(s)')).toBeInTheDocument()
  })

  it('toggles a post status draft -> scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Case study').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /toggle status case study/i }))
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
  })

  it('toggles a post status scheduled -> published', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Launch announcement').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /toggle status launch announcement/i }))
    expect(within(li).getByText('published')).toBeInTheDocument()
  })

  it('toggles a post status published -> draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Product photo').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /toggle status product photo/i }))
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('filters posts by scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.queryByText('Case study')).not.toBeInTheDocument()
  })

  it('filters posts by draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
    expect(screen.getByText('Case study')).toBeInTheDocument()
  })

  it('filters posts by published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
    expect(screen.getByText('Product photo')).toBeInTheDocument()
  })

  it('resets to all filter shows all posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 3 post(s)')).toBeInTheDocument()
  })

  it('Stats shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 33%')).toBeInTheDocument()
  })

  it('Stats updates after adding a scheduled post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Weekly digest', 'Twitter', 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 4')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 50%')).toBeInTheDocument()
  })

  it('Stats updates after deleting a post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Case study' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('Stats reflects toggle status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Case study').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /toggle status case study/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
  })

  it('Stats shows 0% scheduled rate when no posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Launch announcement' }))
    await u.click(screen.getByRole('button', { name: 'Delete Case study' }))
    await u.click(screen.getByRole('button', { name: 'Delete Product photo' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('filter does not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 3')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Posts')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await nav(u, 'Stats')
    await nav(u, 'Posts')
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
  })
})
