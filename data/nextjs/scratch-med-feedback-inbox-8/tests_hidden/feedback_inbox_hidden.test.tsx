// HELD-OUT generalization tests — fresh scenarios and edge cases
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme?: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  if (theme) {
    await u.selectOptions(screen.getByLabelText('Theme'), theme)
  }
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function feedbackRow(note: string): HTMLElement {
  const el = screen.getByText(note)
  const li = el.closest('li')
  if (!li) throw new Error(`no row for ${note}`)
  return li as HTMLElement
}

describe('Feedback Inbox (held-out)', () => {
  it('adding multiple items all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Request one', 'Feature')
    await addFeedback(u, 'Request two', 'UX')
    await addFeedback(u, 'Request three', 'Bug')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('upvoting one item does not change another item upvote count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First item', 'Bug')
    await addFeedback(u, 'Second item', 'UX')
    await u.click(within(feedbackRow('First item')).getByRole('button', { name: /upvote first item/i }))
    expect(within(feedbackRow('Second item')).getByText(/Upvotes: 0/)).toBeInTheDocument()
  })

  it('sort by upvotes with all equal upvotes does not crash', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Equal A', 'Bug')
    await addFeedback(u, 'Equal B', 'Feature')
    await u.click(screen.getByRole('button', { name: /sort by upvotes/i }))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('sort places highest upvoted item first with multiple upvotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low votes', 'UX')
    await addFeedback(u, 'High votes', 'Feature')
    for (let i = 0; i < 5; i++) {
      await u.click(within(feedbackRow('High votes')).getByRole('button', { name: /upvote high votes/i }))
    }
    await u.click(within(feedbackRow('Low votes')).getByRole('button', { name: /upvote low votes/i }))
    await u.click(screen.getByRole('button', { name: /sort by upvotes/i }))
    const items = screen.getAllByRole('listitem')
    expect(within(items[0] as HTMLElement).getByText('High votes')).toBeInTheDocument()
  })

  it('Stats shows correct total upvotes after multiple upvotes on different items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'X', 'Bug')
    await addFeedback(u, 'Y', 'Feature')
    await addFeedback(u, 'Z', 'Performance')
    await u.click(within(feedbackRow('X')).getByRole('button', { name: /upvote x/i }))
    await u.click(within(feedbackRow('X')).getByRole('button', { name: /upvote x/i }))
    await u.click(within(feedbackRow('Z')).getByRole('button', { name: /upvote z/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
  })

  it('top theme ties: first theme by iteration order wins', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'B1', 'Bug')
    await addFeedback(u, 'U1', 'UX')
    await nav(u, 'Stats')
    // Both have 1 item each; Bug comes first in iteration
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('Stats UX count updates cross-view after adding more UX items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'UX idea 1', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    await nav(u, 'Inbox')
    await addFeedback(u, 'UX idea 2', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('UX: 2')).toBeInTheDocument()
  })

  it('clear all and then add new feedback shows correct Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Old item', 'Bug')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    await addFeedback(u, 'New item', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Feature')).toBeInTheDocument()
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

  it('Performance theme items appear in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Slow query', 'Performance')
    await addFeedback(u, 'Long load', 'Performance')
    await nav(u, 'Stats')
    expect(screen.getByText('Performance: 2')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Performance')).toBeInTheDocument()
  })

  it('shows theme in parentheses next to note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Check layout', 'UX')
    const row = feedbackRow('Check layout')
    expect(row.textContent).toContain('(UX)')
  })

  it('note input is cleared after adding feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Temporary note')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect((screen.getByLabelText('Note') as HTMLInputElement).value).toBe('')
  })
})
