// HELD-OUT generalization tests — fresh scenarios and edge cases
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
  it('filter All shows all seeded posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.getByText('Product demo')).toBeInTheDocument()
    expect(screen.getByText('Behind the scenes')).toBeInTheDocument()
  })

  it('filter published shows only published posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
    expect(screen.queryByText('Product demo')).not.toBeInTheDocument()
    expect(screen.queryByText('Behind the scenes')).not.toBeInTheDocument()
  })

  it('adding two scheduled posts updates Scheduled count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Post A', 'Twitter', 'scheduled')
    await addPost(u, 'Post B', 'Instagram', 'scheduled')
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
  })

  it('deleting the only scheduled post drops Scheduled to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete product demo/i }))
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
  })

  it('marking all posts published gives 100% published rate in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark published product demo/i }))
    await u.click(screen.getByRole('button', { name: /mark published behind the scenes/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Published rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Published: 3')).toBeInTheDocument()
  })

  it('stats LinkedIn count increases when a LinkedIn post is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Thought leadership', 'LinkedIn', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('LinkedIn: 2')).toBeInTheDocument()
  })

  it('stats Draft count decreases after marking a draft post published', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark published behind the scenes/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
  })

  it('adding a post with platform Twitter is reflected in Stats Twitter count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Tweet this', 'Twitter', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Twitter: 2')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('posts list item shows platform text', () => {
    render(<App />)
    const li = screen.getByText('Launch announcement').closest('li') as HTMLElement
    expect(within(li).getByText('Twitter')).toBeInTheDocument()
  })

  it('posts list item shows status text', () => {
    render(<App />)
    const li = screen.getByText('Product demo').closest('li') as HTMLElement
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
  })

  it('delete removes post and stats update accordingly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete launch announcement/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 2')).toBeInTheDocument()
    expect(screen.getByText('Twitter: 0')).toBeInTheDocument()
  })
})
