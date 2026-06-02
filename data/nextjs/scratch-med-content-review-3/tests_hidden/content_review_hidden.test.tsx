// HELD-OUT generalization tests
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.clear(screen.getByLabelText('Reviewer'))
  await u.type(screen.getByLabelText('Reviewer'), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Content Review Tracker (held-out)', () => {
  it('seeded item About us has status changes', () => {
    render(<App />)
    expect(within(itemRow('About us')).getByText('changes')).toBeInTheDocument()
  })

  it('seeded item Pricing page has reviewer Bob', () => {
    render(<App />)
    expect(within(itemRow('Pricing page')).getByText('Bob')).toBeInTheDocument()
  })

  it('approving all items gives 100% in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const t of ['Homepage copy', 'Pricing page', 'About us']) {
      await u.click(within(itemRow(t)).getByRole('button', { name: /approve/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Approved %: 100%')).toBeInTheDocument()
    expect(screen.getByText('Approved: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 0')).toBeInTheDocument()
  })

  it('requesting changes on all items gives 0% approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const t of ['Homepage copy', 'Pricing page', 'About us']) {
      await u.click(within(itemRow(t)).getByRole('button', { name: /request changes/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Approved %: 0%')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 3')).toBeInTheDocument()
  })

  it('filter by changes shows only About us initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'changes')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Homepage copy')).not.toBeInTheDocument()
    expect(screen.queryByText('Pricing page')).not.toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
  })

  it('item count under filter updates after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByRole('heading', { name: 'Items (1)' })).toBeInTheDocument()
    // go back to all, approve Homepage copy, re-filter
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /approve/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'approved')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('deleting an item decrements Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(itemRow('About us')).getByRole('button', { name: /delete/i }))
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Approved %: 100%')).toBeInTheDocument()
  })

  it('adding multiple items updates Stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Case study', 'Eve')
    await addItem(u, 'FAQ page', 'Frank')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 5')).toBeInTheDocument()
    expect(screen.getByText('Draft: 3')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter resets to All shows all items including newly added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'draft')
    await addItem(u, 'Terms page', 'Grace')
    // Should show 2 draft items now (Homepage copy + Terms page)
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByRole('heading', { name: 'Items (4)' })).toBeInTheDocument()
  })

  it('can transition item status multiple times', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = itemRow('Homepage copy')
    await u.click(within(row).getByRole('button', { name: /approve/i }))
    expect(within(itemRow('Homepage copy')).getByText('approved')).toBeInTheDocument()
    await u.click(within(itemRow('Homepage copy')).getByRole('button', { name: /request changes/i }))
    expect(within(itemRow('Homepage copy')).getByText('changes')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes requested: 2')).toBeInTheDocument()
  })
})
