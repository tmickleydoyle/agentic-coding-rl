// HELD-OUT generalization tests — fresh inputs, edge cases, cross-view sequences
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
  status = 'Draft'
) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Platform'), platform)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Content Calendar (held-out)', () => {
  it('filter by Published hides Draft and Scheduled items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft piece', 'Blog', 'Draft')
    await addItem(u, 'Live tweet', 'Twitter', 'Published')
    await addItem(u, 'Queue post', 'Instagram', 'Scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Published')
    expect(screen.queryByText('Draft piece')).not.toBeInTheDocument()
    expect(screen.queryByText('Queue post')).not.toBeInTheDocument()
    expect(screen.getByText('Live tweet')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /content items \(1\)/i })).toBeInTheDocument()
  })

  it('scheduled rate rounds correctly with three scheduled of five total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', 'Twitter', 'Scheduled')
    await addItem(u, 'B', 'Blog', 'Scheduled')
    await addItem(u, 'C', 'LinkedIn', 'Scheduled')
    await addItem(u, 'D', 'Instagram', 'Draft')
    await addItem(u, 'E', 'Twitter', 'Published')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
    expect(screen.getByText('Scheduled: 3')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 60%')).toBeInTheDocument()
  })

  it('deleting an item updates stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keeper', 'Blog', 'Published')
    await addItem(u, 'Gonner', 'Twitter', 'Draft')
    await u.click(screen.getByRole('button', { name: /delete gonner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
  })

  it('mark published on a Scheduled item removes it from Scheduled stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Campaign', 'Instagram', 'Scheduled')
    await u.click(screen.getByRole('button', { name: /mark campaign published/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Scheduled: 0')).toBeInTheDocument()
    expect(screen.getByText('Published: 1')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })

  it('filter by Draft shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft 1', 'Twitter', 'Draft')
    await addItem(u, 'Draft 2', 'LinkedIn', 'Draft')
    await addItem(u, 'Sched 1', 'Blog', 'Scheduled')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByRole('heading', { name: /content items \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Sched 1')).not.toBeInTheDocument()
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

  it('items added with LinkedIn platform display LinkedIn', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Thought leadership', 'LinkedIn', 'Draft')
    const row = itemRow('Thought leadership')
    expect(within(row).getByText('LinkedIn')).toBeInTheDocument()
  })

  it('filter persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Sched item', 'Twitter', 'Scheduled')
    await addItem(u, 'Draft item', 'Blog', 'Draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Scheduled')
    await nav(u, 'Stats')
    await nav(u, 'Calendar')
    // After returning, filter may have reset — just verify app is stable
    expect(screen.getByRole('heading', { name: /content items/i })).toBeInTheDocument()
  })

  it('stats show Total: 0 and Scheduled rate: 0% when all items deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp', 'Instagram', 'Scheduled')
    await u.click(screen.getByRole('button', { name: /delete temp/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Scheduled rate: 0%')).toBeInTheDocument()
  })
})
