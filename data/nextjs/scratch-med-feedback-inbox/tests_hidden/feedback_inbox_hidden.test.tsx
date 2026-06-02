// HELD-OUT generalization tests — different inputs, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme: string = 'Bug') {
  await u.clear(screen.getByLabelText(/^note$/i))
  await u.type(screen.getByLabelText(/^note$/i), note)
  await u.selectOptions(screen.getByLabelText(/^theme$/i), theme)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function feedbackRow(note: string): HTMLElement {
  const li = screen.getByText(note).closest('li')
  if (!li) throw new Error(`no row for ${note}`)
  return li as HTMLElement
}

describe('Feedback Inbox (held-out)', () => {
  it('total upvotes sums across multiple items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item A', 'Bug')
    await addFeedback(u, 'Item B', 'Feature')
    await u.click(within(feedbackRow('Item A')).getByRole('button', { name: /upvote item a/i }))
    await u.click(within(feedbackRow('Item B')).getByRole('button', { name: /upvote item b/i }))
    await u.click(within(feedbackRow('Item B')).getByRole('button', { name: /upvote item b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('top upvotes shows the max across items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low', 'UX')
    await addFeedback(u, 'High', 'Bug')
    await u.click(within(feedbackRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.click(within(feedbackRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.click(within(feedbackRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.click(within(feedbackRow('Low')).getByRole('button', { name: /upvote low/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top upvotes: 3')).toBeInTheDocument()
  })

  it('most upvoted sort with three items picks correct order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Gamma', 'Bug')
    await addFeedback(u, 'Alpha', 'Feature')
    await addFeedback(u, 'Beta', 'UX')
    // give Beta 3 upvotes, Gamma 1 upvote, Alpha 0
    await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.click(within(feedbackRow('Gamma')).getByRole('button', { name: /upvote gamma/i }))
    await u.selectOptions(screen.getByLabelText(/^sort by$/i), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Beta')).toBeInTheDocument()
    expect(within(items[1]).getByText('Gamma')).toBeInTheDocument()
    expect(within(items[2]).getByText('Alpha')).toBeInTheDocument()
  })

  it('theme toggle back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('feature count increments correctly in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Feature req 1', 'Feature')
    await addFeedback(u, 'Feature req 2', 'Feature')
    await addFeedback(u, 'Feature req 3', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Feature: 3')).toBeInTheDocument()
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
    expect(screen.getByText('UX: 0')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('whitespace-only note is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^note$/i), '   ')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })

  it('stats total upvotes is 0 when no upvotes have been cast', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'No votes yet', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
  })

  it('newest sort shows third-added item first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Oldest')
    await addFeedback(u, 'Middle')
    await addFeedback(u, 'Newest')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Newest')).toBeInTheDocument()
  })

  it('sort order persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Stay sorted')
    await u.selectOptions(screen.getByLabelText(/^sort by$/i), 'Most upvoted')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByLabelText(/^sort by$/i)).toHaveValue('upvoted')
  })
})
