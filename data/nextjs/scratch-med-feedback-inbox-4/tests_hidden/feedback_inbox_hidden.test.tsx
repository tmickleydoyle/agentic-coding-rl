// HELD-OUT generalization tests — different inputs and sequences, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme: string) {
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
  it('shows all four theme counts in Stats even with no data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
    expect(screen.getByText('Feature: 0')).toBeInTheDocument()
    expect(screen.getByText('UX: 0')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('UX theme items are counted separately in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Confusing layout', 'UX')
    await addFeedback(u, 'Hard to read', 'UX')
    await addFeedback(u, 'Missing icon', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('UX: 3')).toBeInTheDocument()
    expect(screen.getByText('Top theme: UX')).toBeInTheDocument()
  })

  it('Other theme is counted in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Misc item', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Other')).toBeInTheDocument()
  })

  it('toggling theme back to light sets data-theme to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Total feedback updates correctly after multiple additions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item one', 'Bug')
    await addFeedback(u, 'Item two', 'Feature')
    await addFeedback(u, 'Item three', 'UX')
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
  })

  it('upvoting persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Stay upvoted', 'Bug')
    await u.click(within(itemRow('Stay upvoted')).getByRole('button', { name: /upvote stay upvoted/i }))
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(within(itemRow('Stay upvoted')).getByText('Upvotes: 1')).toBeInTheDocument()
  })

  it('items in Newest order are in insertion order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Earliest', 'Bug')
    await addFeedback(u, 'Middle', 'UX')
    await addFeedback(u, 'Latest', 'Feature')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Earliest')).toBeInTheDocument()
    expect(within(items[2]).getByText('Latest')).toBeInTheDocument()
  })

  it('most upvoted sort: equal upvotes preserve relative positions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Tie A', 'Bug')
    await addFeedback(u, 'Tie B', 'Feature')
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Tie A')).toBeInTheDocument()
    expect(within(items[1]).getByText('Tie B')).toBeInTheDocument()
  })

  it('Stats top theme updates as more items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug one', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
    await nav(u, 'Inbox')
    await addFeedback(u, 'Feat one', 'Feature')
    await addFeedback(u, 'Feat two', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Feature')).toBeInTheDocument()
  })

  it('Stats Total matches Inbox Total feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'X', 'UX')
    await addFeedback(u, 'Y', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('blank-only whitespace note is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), '   ')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })
})
