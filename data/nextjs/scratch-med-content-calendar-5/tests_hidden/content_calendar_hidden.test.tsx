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

describe('Content Calendar (held-out)', () => {
  it('seeded posts show correct platform labels', () => {
    render(<App />)
    const li1 = screen.getByText('Launch announcement').closest('li') as HTMLElement
    expect(within(li1).getByText('Twitter')).toBeInTheDocument()
    const li2 = screen.getByText('Case study').closest('li') as HTMLElement
    expect(within(li2).getByText('LinkedIn')).toBeInTheDocument()
    const li3 = screen.getByText('Product photo').closest('li') as HTMLElement
    expect(within(li3).getByText('Instagram')).toBeInTheDocument()
  })

  it('full cycle toggle: published -> draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Product photo').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /toggle status product photo/i }))
    expect(within(li).getByText('draft')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: /toggle status product photo/i }))
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: /toggle status product photo/i }))
    expect(within(li).getByText('published')).toBeInTheDocument()
  })

  it('adding a draft post updates Stats Draft count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Rough notes', 'Instagram', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('adding a published post updates Stats Published count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Live update', 'Twitter', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
  })

  it('scheduled rate with all scheduled', async () => {
    const u = userEvent.setup()
    render(<App />)
    // toggle case study draft->scheduled and product photo published->draft->scheduled
    const li2 = screen.getByText('Case study').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: /toggle status case study/i }))
    const li3 = screen.getByText('Product photo').closest('li') as HTMLElement
    await u.click(within(li3).getByRole('button', { name: /toggle status product photo/i })) // published->draft
    await u.click(within(li3).getByRole('button', { name: /toggle status product photo/i })) // draft->scheduled
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 100%')).toBeInTheDocument()
  })

  it('filter by scheduled hides draft and published posts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.queryByText('Case study')).not.toBeInTheDocument()
    expect(screen.queryByText('Product photo')).not.toBeInTheDocument()
    expect(screen.getByText('Launch announcement')).toBeInTheDocument()
  })

  it('filter then add post with same status increases Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
    await addPost(u, 'Another draft', 'LinkedIn', 'draft')
    expect(screen.getByText('Showing: 2 post(s)')).toBeInTheDocument()
  })

  it('filter then add post with different status does not appear in filtered view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await addPost(u, 'Hidden post', 'Twitter', 'published')
    expect(screen.queryByText('Hidden post')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 post(s)')).toBeInTheDocument()
  })

  it('Stats counts hidden-by-filter post', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    await addPost(u, 'Hidden published', 'Instagram', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total posts: 4')).toBeInTheDocument()
    expect(screen.getByText('Published: 2')).toBeInTheDocument()
  })

  it('deleting all posts leaves empty list and Showing 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Launch announcement' }))
    await u.click(screen.getByRole('button', { name: 'Delete Case study' }))
    await u.click(screen.getByRole('button', { name: 'Delete Product photo' }))
    expect(screen.getByText('Showing: 0 post(s)')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('posts list state persists when visiting Stats and returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addPost(u, 'Sticky post', 'Twitter', 'scheduled')
    await nav(u, 'Stats')
    await nav(u, 'Posts')
    expect(screen.getByText('Sticky post')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 post(s)')).toBeInTheDocument()
  })
})
