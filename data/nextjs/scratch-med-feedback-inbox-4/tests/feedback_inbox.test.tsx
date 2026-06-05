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

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('shows Total feedback: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
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

  it('adds a feedback item and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Login is broken', 'Bug')
    expect(screen.getByText('Login is broken')).toBeInTheDocument()
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
  })

  it('ignores blank note on submit', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })

  it('shows upvote count as Upvotes: 0 initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    expect(within(itemRow('Dark mode please')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('increments upvotes when Upvote is clicked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Slow load', 'Bug')
    await u.click(within(itemRow('Slow load')).getByRole('button', { name: /upvote slow load/i }))
    expect(within(itemRow('Slow load')).getByText('Upvotes: 1')).toBeInTheDocument()
    await u.click(within(itemRow('Slow load')).getByRole('button', { name: /upvote slow load/i }))
    expect(within(itemRow('Slow load')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('sorts by most upvoted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'UX')
    await addFeedback(u, 'Beta', 'Bug')
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Beta')).toBeInTheDocument()
    expect(within(items[1]).getByText('Alpha')).toBeInTheDocument()
  })

  it('reverts to newest order after switching back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First', 'Other')
    await addFeedback(u, 'Second', 'UX')
    await u.click(within(itemRow('Second')).getByRole('button', { name: /upvote second/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Newest')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('First')).toBeInTheDocument()
    expect(within(items[1]).getByText('Second')).toBeInTheDocument()
  })

  it('Stats shows Total: 0 and Top theme: None when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('Stats shows per-theme counts (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Crash on save', 'Bug')
    await addFeedback(u, 'Add export', 'Feature')
    await addFeedback(u, 'Button too small', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 0')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('Stats shows correct Top theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Req 1', 'Feature')
    await addFeedback(u, 'Req 2', 'Feature')
    await addFeedback(u, 'Bug 1', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Feature')).toBeInTheDocument()
  })

  it('Stats top theme breaks tie by first in Bug->Feature->UX->Other order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'A UX issue', 'UX')
    await addFeedback(u, 'A Bug', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('theme toggle sets data-theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inbox')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('feedback added on Inbox is reflected in Stats Total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'Other')
    await addFeedback(u, 'Two', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Other: 2')).toBeInTheDocument()
  })

  it('inbox state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Remember me', 'UX')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Remember me')).toBeInTheDocument()
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
  })

  it('sort order is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'P', 'Bug')
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect((screen.getByLabelText('Sort by') as HTMLSelectElement).value).toBe('upvotes')
  })

  it('multiple upvotes on different items sort correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low', 'Bug')
    await addFeedback(u, 'High', 'Feature')
    await u.click(within(itemRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.click(within(itemRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.click(within(itemRow('High')).getByRole('button', { name: /upvote high/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Upvotes: 3')).toBeInTheDocument()
  })
})
