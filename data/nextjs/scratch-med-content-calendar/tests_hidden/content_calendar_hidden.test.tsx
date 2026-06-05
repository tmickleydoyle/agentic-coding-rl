// HELD-OUT generalization tests — fresh cross-view scenarios, edge cases, and sequences.
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

describe('Content Calendar (held-out)', () => {
  it('seeded data includes correct platforms in the list', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    expect(texts.some((t) => t.includes('Twitter'))).toBe(true)
    expect(texts.some((t) => t.includes('LinkedIn'))).toBe(true)
    expect(texts.some((t) => t.includes('Instagram'))).toBe(true)
  })

  it('each seeded post has a Delete button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Delete Launch announcement' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Product demo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Behind the scenes' })).toBeInTheDocument()
  })

  it('adds multiple scheduled posts and Scheduled count increments correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Sched 1', 'Twitter', 'Scheduled')
    await addPost(u, 'Sched 2', 'Blog', 'Scheduled')
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
  })

  it('deleting a scheduled post decrements Scheduled count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Product demo' }))
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
  })

  it('filter by Published shows only published posts count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Extra published', 'Blog', 'Published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Published')
    expect(screen.getByText('Showing: 2 posts')).toBeInTheDocument()
  })

  it('filter by Draft after adding a new draft shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'New draft', 'Instagram', 'Draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Showing: 2 posts')).toBeInTheDocument()
    expect(screen.getByText('New draft')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('deleting a post while a filter is active updates showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Showing: 1 posts')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Behind the scenes' }))
    expect(screen.getByText('Showing: 0 posts')).toBeInTheDocument()
  })

  it('stats Draft count updates after adding a new draft post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Draft idea', 'LinkedIn', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('stats Scheduled count updates after adding a scheduled post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Campaign post', 'Twitter', 'Scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
  })

  it('stats reflect deletion of published post (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Launch announcement' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 2')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
    expect(screen.getByText('Publish rate: 0%')).toBeInTheDocument()
  })

  it('publish rate rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    // 1 published out of 3 = 33%
    await nav(u, 'Stats')
    expect(screen.getByText('Publish rate: 33%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})
