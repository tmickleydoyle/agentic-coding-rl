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
  const li = screen.getByText(note).closest('li')
  if (!li) throw new Error(`no row for ${note}`)
  return li as HTMLElement
}

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
    expect(screen.getByText('Feedback: 0')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a feedback item and shows the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Login is broken', 'Bug')
    expect(screen.getByText('Login is broken')).toBeInTheDocument()
    expect(screen.getByText('Feedback: 1')).toBeInTheDocument()
  })

  it('ignores a blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Feedback: 0')).toBeInTheDocument()
  })

  it('clears the note input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Some note', 'UX')
    expect(screen.getByLabelText('Note')).toHaveValue('')
  })

  it('shows upvote count starting at 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    expect(within(itemRow('Dark mode please')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('increments upvotes when Upvote is clicked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Better search', 'Feature')
    await u.click(within(itemRow('Better search')).getByRole('button', { name: /upvote better search/i }))
    expect(within(itemRow('Better search')).getByText('Upvotes: 1')).toBeInTheDocument()
    await u.click(within(itemRow('Better search')).getByRole('button', { name: /upvote better search/i }))
    expect(within(itemRow('Better search')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('sorts items by upvotes descending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low priority', 'Other')
    await addFeedback(u, 'High priority', 'Bug')
    await u.click(within(itemRow('High priority')).getByRole('button', { name: /upvote high priority/i }))
    await u.click(within(itemRow('High priority')).getByRole('button', { name: /upvote high priority/i }))
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('High priority')
    expect(items[1]).toHaveTextContent('Low priority')
  })

  it('shows theme tag on each item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Crash on save', 'Bug')
    expect(within(itemRow('Crash on save')).getByText('Bug')).toBeInTheDocument()
  })

  it('Stats shows Total: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })

  it('Stats shows Top item: none when no feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top item: none')).toBeInTheDocument()
  })

  it('Stats reflects added items (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix export', 'Bug')
    await addFeedback(u, 'Add filters', 'Feature')
    await addFeedback(u, 'Mobile layout', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Bug: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('Stats shows top item as the highest-upvoted note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Needs search', 'Feature')
    await addFeedback(u, 'Page crashes', 'Bug')
    await u.click(within(itemRow('Page crashes')).getByRole('button', { name: /upvote page crashes/i }))
    await u.click(within(itemRow('Page crashes')).getByRole('button', { name: /upvote page crashes/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top item: Page crashes')).toBeInTheDocument()
  })

  it('clears all feedback via Settings and resets count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'To be removed', 'Other')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    expect(screen.getByText('Feedback: 0')).toBeInTheDocument()
    expect(screen.queryByText('To be removed')).not.toBeInTheDocument()
  })

  it('Stats shows zeros after clearing (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Something', 'Bug')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
    expect(screen.getByText('Top item: none')).toBeInTheDocument()
  })

  it('toggles the UI theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Inbox')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves inbox state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'UX')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
    expect(screen.getByText('Feedback: 1')).toBeInTheDocument()
  })

  it('multiple items with same theme are all counted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug one', 'Bug')
    await addFeedback(u, 'Bug two', 'Bug')
    await addFeedback(u, 'Bug three', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })
})
