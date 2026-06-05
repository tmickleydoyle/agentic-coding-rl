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

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
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

  it('navigates back to Inbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('adds a feedback item with note and theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Login is broken', 'Bug')
    expect(screen.getByText('Login is broken')).toBeInTheDocument()
    expect(screen.getByText(/\(Bug\)/)).toBeInTheDocument()
  })

  it('new item starts with Upvotes: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Slow load', 'Performance')
    expect(within(feedbackRow('Slow load')).getByText(/Upvotes: 0/)).toBeInTheDocument()
  })

  it('ignores blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('upvote increments count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    await u.click(within(feedbackRow('Dark mode please')).getByRole('button', { name: /upvote dark mode please/i }))
    expect(within(feedbackRow('Dark mode please')).getByText(/Upvotes: 1/)).toBeInTheDocument()
    await u.click(within(feedbackRow('Dark mode please')).getByRole('button', { name: /upvote dark mode please/i }))
    expect(within(feedbackRow('Dark mode please')).getByText(/Upvotes: 2/)).toBeInTheDocument()
  })

  it('sort by upvotes reorders items descending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Bug')
    await addFeedback(u, 'Beta', 'Feature')
    await addFeedback(u, 'Gamma', 'UX')
    // Give Beta 3 upvotes, Gamma 1
    for (let i = 0; i < 3; i++) {
      await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    }
    await u.click(within(feedbackRow('Gamma')).getByRole('button', { name: /upvote gamma/i }))
    await u.click(screen.getByRole('button', { name: /sort by upvotes/i }))
    const items = screen.getAllByRole('listitem')
    expect(within(items[0] as HTMLElement).getByText('Beta')).toBeInTheDocument()
    expect(within(items[1] as HTMLElement).getByText('Gamma')).toBeInTheDocument()
    expect(within(items[2] as HTMLElement).getByText('Alpha')).toBeInTheDocument()
  })

  it('stats shows Total feedback: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })

  it('stats shows Total upvotes: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
  })

  it('stats shows Top theme: None when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('stats reflects added feedback (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Crash on save', 'Bug')
    await addFeedback(u, 'Better search', 'Feature')
    await addFeedback(u, 'Form layout', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
  })

  it('stats shows correct count per theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug one', 'Bug')
    await addFeedback(u, 'Bug two', 'Bug')
    await addFeedback(u, 'Feature one', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
  })

  it('stats does not show themes with zero items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Only a bug', 'Bug')
    await nav(u, 'Stats')
    expect(screen.queryByText(/^UX:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Performance:/)).not.toBeInTheDocument()
  })

  it('stats shows Top theme based on item count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'F1', 'Feature')
    await addFeedback(u, 'F2', 'Feature')
    await addFeedback(u, 'B1', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Feature')).toBeInTheDocument()
  })

  it('stats total upvotes sums across all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item A', 'UX')
    await addFeedback(u, 'Item B', 'Bug')
    await u.click(within(feedbackRow('Item A')).getByRole('button', { name: /upvote item a/i }))
    await u.click(within(feedbackRow('Item A')).getByRole('button', { name: /upvote item a/i }))
    await u.click(within(feedbackRow('Item B')).getByRole('button', { name: /upvote item b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('settings toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inbox')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all feedback removes all items and resets Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'To delete', 'Bug')
    await addFeedback(u, 'Also gone', 'UX')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('feedback list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persist me', 'Performance')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('Theme selector has all four options', async () => {
    render(<App />)
    const select = screen.getByLabelText('Theme') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.text)
    expect(options).toContain('Bug')
    expect(options).toContain('Feature')
    expect(options).toContain('UX')
    expect(options).toContain('Performance')
  })
})
