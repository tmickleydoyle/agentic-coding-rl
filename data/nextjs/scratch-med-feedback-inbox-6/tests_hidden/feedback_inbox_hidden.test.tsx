import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme = 'Bug') {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.selectOptions(screen.getByLabelText('Theme'), theme)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Feedback Inbox (held-out)', () => {
  it('adds multiple items and they all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First item', 'Bug')
    await addFeedback(u, 'Second item', 'Feature')
    await addFeedback(u, 'Third item', 'UX')
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.getByText('Third item')).toBeInTheDocument()
  })

  it('each item shows its own theme badge', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Report bug', 'Bug')
    await addFeedback(u, 'Request feature', 'Feature')
    expect(within(itemRow('Report bug')).getByText('[Bug]')).toBeInTheDocument()
    expect(within(itemRow('Request feature')).getByText('[Feature]')).toBeInTheDocument()
  })

  it('upvotes on different items are tracked independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha note', 'Bug')
    await addFeedback(u, 'Beta note', 'UX')
    await u.click(screen.getByRole('button', { name: /upvote alpha note/i }))
    expect(within(itemRow('Alpha note')).getByText('Upvotes: 1')).toBeInTheDocument()
    expect(within(itemRow('Beta note')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('sort by Date added restores insertion order after switching back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Older item', 'Bug')
    await addFeedback(u, 'Newer item', 'Feature')
    // upvote older so it would be first by upvotes
    await u.click(screen.getByRole('button', { name: /upvote older item/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Upvotes')
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Date added')
    const allItems = screen.getAllByText(/Upvotes: \d+/)
    // newest first: Newer item then Older item
    expect(allItems[0]).toHaveTextContent('Upvotes: 0')
    expect(allItems[1]).toHaveTextContent('Upvotes: 1')
  })

  it('stats Other theme count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Misc one', 'Other')
    await addFeedback(u, 'Misc two', 'Other')
    await addFeedback(u, 'Misc three', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 3')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Other')).toBeInTheDocument()
  })

  it('stats total upvotes sums across all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'P', 'Bug')
    await addFeedback(u, 'Q', 'Feature')
    await u.click(screen.getByRole('button', { name: /upvote p/i }))
    await u.click(screen.getByRole('button', { name: /upvote p/i }))
    await u.click(screen.getByRole('button', { name: /upvote q/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('adding items after clear all works correctly in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Gone', 'Bug')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await addFeedback(u, 'Fresh start', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
    expect(screen.getByText('Top theme: UX')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats updates live as items are added then viewed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Watch me', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    await nav(u, 'Inbox')
    await addFeedback(u, 'Another', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 2')).toBeInTheDocument()
    expect(screen.getByText('Feature: 2')).toBeInTheDocument()
  })

  it('upvote count is reflected in stats total upvotes cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Vote me up', 'UX')
    await u.click(screen.getByRole('button', { name: /upvote vote me up/i }))
    await u.click(screen.getByRole('button', { name: /upvote vote me up/i }))
    await u.click(screen.getByRole('button', { name: /upvote vote me up/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })
})
