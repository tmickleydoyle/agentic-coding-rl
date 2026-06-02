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
  it('starts with Content (0) heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Content (0)' })).toBeInTheDocument()
  })

  it('adds multiple items and count updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'First', 'Twitter', 'draft')
    await addItem(u, 'Second', 'Instagram', 'scheduled')
    await addItem(u, 'Third', 'LinkedIn', 'published')
    expect(screen.getByRole('heading', { name: /content \(3\)/i })).toBeInTheDocument()
  })

  it('filter by published hides others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Live piece', 'LinkedIn', 'published')
    await addItem(u, 'Upcoming', 'Twitter', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'published')
    expect(screen.getByText('Live piece')).toBeInTheDocument()
    expect(screen.queryByText('Upcoming')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content \(1\)/i })).toBeInTheDocument()
  })

  it('inline status change is reflected in stats without navigating away', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Reel', 'Instagram', 'draft')
    await addItem(u, 'Tweet', 'Twitter', 'draft')
    await u.selectOptions(screen.getByLabelText('Status for Reel'), 'scheduled')
    await u.selectOptions(screen.getByLabelText('Status for Tweet'), 'scheduled')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 100%')).toBeInTheDocument()
  })

  it('deleting items updates stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gone', 'Twitter', 'scheduled')
    await addItem(u, 'Stays', 'Twitter', 'draft')
    await u.click(screen.getByRole('button', { name: /delete gone/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('filter does not affect stats count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'D1', 'Twitter', 'draft')
    await addItem(u, 'D2', 'Twitter', 'draft')
    await addItem(u, 'S1', 'Instagram', 'scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByRole('heading', { name: /content \(2\)/i })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 1')).toBeInTheDocument()
  })

  it('scheduled rate is 0% with only draft and published items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'D', 'Twitter', 'draft')
    await addItem(u, 'P', 'Instagram', 'published')
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('adding item clears the title input', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Clear me')
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('content list is preserved after visiting stats and coming back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Remember me', 'LinkedIn', 'scheduled')
    await nav(u, 'Stats')
    await nav(u, 'Content')
    expect(screen.getByText('Remember me')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content \(1\)/i })).toBeInTheDocument()
  })

  it('each item shows its platform', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'LinkedIn post', 'LinkedIn', 'draft')
    const li = screen.getByText('LinkedIn post').closest('li') as HTMLElement
    expect(within(li).getByText('LinkedIn')).toBeInTheDocument()
  })
})
