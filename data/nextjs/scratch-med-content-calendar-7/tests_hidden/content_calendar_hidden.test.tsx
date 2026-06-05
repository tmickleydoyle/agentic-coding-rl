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

describe('Content Calendar (held-out)', () => {
  it('filter by scheduled shows only scheduled items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft piece', 'Blog', 'draft')
    await addItem(u, 'Sched piece', 'Twitter', 'scheduled')
    await addItem(u, 'Pub piece', 'LinkedIn', 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'scheduled')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Sched piece')).toBeInTheDocument()
    expect(screen.queryByText('Draft piece')).not.toBeInTheDocument()
    expect(screen.queryByText('Pub piece')).not.toBeInTheDocument()
  })

  it('filter by published shows only published items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Article', 'Blog', 'published')
    await addItem(u, 'Reel', 'Instagram', 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Article')).toBeInTheDocument()
    expect(screen.queryByText('Reel')).not.toBeInTheDocument()
  })

  it('deleting one of two items decrements count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep me', 'Blog', 'draft')
    await addItem(u, 'Remove me', 'Twitter', 'draft')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Keep me')).toBeInTheDocument()
  })

  it('scheduled rate rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'S1', 'Blog', 'scheduled')
    await addItem(u, 'D1', 'Blog', 'draft')
    await addItem(u, 'D2', 'Blog', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 33%')).toBeInTheDocument()
  })

  it('stats updates after deleting an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To remove', 'Blog', 'scheduled')
    await addItem(u, 'To keep', 'Twitter', 'draft')
    await u.click(screen.getByRole('button', { name: /delete to remove/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('multiple items with same status all show when filtered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft A', 'Blog', 'draft')
    await addItem(u, 'Draft B', 'Twitter', 'draft')
    await addItem(u, 'Draft C', 'Instagram', 'draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 3 items')).toBeInTheDocument()
  })

  it('LinkedIn platform appears on item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'LinkedIn update', 'LinkedIn', 'published')
    const li = screen.getByText('LinkedIn update').closest('li') as HTMLElement
    expect(within(li).getByText('LinkedIn')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('all four platforms are selectable', async () => {
    const u = userEvent.setup()
    render(<App />)
    const select = screen.getByLabelText('Platform')
    for (const p of ['Blog', 'Twitter', 'Instagram', 'LinkedIn']) {
      await u.selectOptions(select, p)
      expect((select as HTMLSelectElement).value).toBe(p)
    }
  })

  it('Stats view shows all stat lines', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })
})
