import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(
  u: U,
  title: string,
  platform = 'Twitter',
  status = 'draft',
) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Content Calendar (held-out)', () => {
  it('adds multiple items and count updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha post', 'Twitter', 'draft')
    await addItem(u, 'Beta post', 'Blog', 'scheduled')
    await addItem(u, 'Gamma post', 'Instagram', 'published')
    expect(screen.getByRole('heading', { name: 'Items (3)' })).toBeInTheDocument()
  })

  it('filter by published shows only published items with correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Pub one', 'Blog', 'published')
    await addItem(u, 'Sched one', 'Twitter', 'scheduled')
    await addItem(u, 'Pub two', 'Instagram', 'published')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Sched one')).not.toBeInTheDocument()
    expect(screen.getByText('Pub one')).toBeInTheDocument()
    expect(screen.getByText('Pub two')).toBeInTheDocument()
  })

  it('filter by draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft only', 'LinkedIn', 'draft')
    await addItem(u, 'Scheduled only', 'Twitter', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Draft only')).toBeInTheDocument()
    expect(screen.queryByText('Scheduled only')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('cycling status updates stats view correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Will schedule', 'Twitter', 'draft')
    const li = screen.getByText('Will schedule').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /change status/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 100%')).toBeInTheDocument()
  })

  it('deleting an item updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To remove', 'Blog', 'scheduled')
    await addItem(u, 'To keep', 'Instagram', 'draft')
    await u.click(screen.getByRole('button', { name: /delete to remove/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('scheduled rate rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'S1', 'Twitter', 'scheduled')
    await addItem(u, 'D1', 'Twitter', 'draft')
    await addItem(u, 'D2', 'Twitter', 'draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 33%')).toBeInTheDocument()
  })

  it('items show their status text in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Check status', 'Instagram', 'scheduled')
    const li = screen.getByText('Check status').closest('li') as HTMLElement
    expect(within(li).getByText('scheduled')).toBeInTheDocument()
  })

  it('deleting one of multiple items leaves the rest', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep me', 'Blog', 'draft')
    await addItem(u, 'Remove me', 'Blog', 'draft')
    await u.click(screen.getByRole('button', { name: /delete remove me/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
  })

  it('toggle theme can be toggled back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('platform Blog is available and saved correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post', 'Blog', 'published')
    const li = screen.getByText('Blog post').closest('li') as HTMLElement
    expect(within(li).getByText('Blog')).toBeInTheDocument()
    expect(within(li).getByText('published')).toBeInTheDocument()
  })
})
