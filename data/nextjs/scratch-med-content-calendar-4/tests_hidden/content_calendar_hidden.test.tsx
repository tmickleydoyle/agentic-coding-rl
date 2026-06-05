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

describe('Content Calendar (held-out)', () => {
  it('shows platform label for each seeded post', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    expect(texts.some((t) => t.includes('Twitter'))).toBe(true)
    expect(texts.some((t) => t.includes('Instagram'))).toBe(true)
    expect(texts.some((t) => t.includes('LinkedIn'))).toBe(true)
  })

  it('shows status label for each seeded post', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const texts = items.map((li) => li.textContent ?? '')
    expect(texts.some((t) => t.includes('scheduled'))).toBe(true)
    expect(texts.some((t) => t.includes('draft'))).toBe(true)
    expect(texts.some((t) => t.includes('published'))).toBe(true)
  })

  it('adding two scheduled posts makes Scheduled %: 60%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Extra A', 'Twitter', 'scheduled')
    await addPost(u, 'Extra B', 'Instagram', 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
    expect(screen.getByText('Scheduled %: 60%')).toBeInTheDocument()
  })

  it('filter to published then add a new post keeps filter active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByRole('heading', { name: 'Posts (1)' })).toBeInTheDocument()
    await addPost(u, 'New pub post', 'LinkedIn', 'published')
    expect(screen.getByRole('heading', { name: 'Posts (2)' })).toBeInTheDocument()
    expect(screen.getByText('New pub post')).toBeInTheDocument()
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
  })

  it('delete all posts then Stats shows Total: 0 and Draft: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    await u.click(screen.getByRole('button', { name: /delete behind the scenes/i }))
    await u.click(screen.getByRole('button', { name: /delete case study/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
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

  it('adding a draft post updates Draft count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Draft idea', 'Twitter', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('filter by scheduled shows empty when no scheduled posts remain', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByRole('heading', { name: 'Posts (0)' })).toBeInTheDocument()
  })

  it('Stats Published count updates after adding a published post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Press release', 'LinkedIn', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
  })
})
