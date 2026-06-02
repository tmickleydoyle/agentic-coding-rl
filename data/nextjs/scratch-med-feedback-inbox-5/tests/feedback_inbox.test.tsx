import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function entryRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('shows the three seed entries on load', () => {
    render(<App />)
    expect(screen.getByText('Login page is broken')).toBeInTheDocument()
    expect(screen.getByText('Add dark mode')).toBeInTheDocument()
    expect(screen.getByText('Button too small')).toBeInTheDocument()
  })

  it('seed entries show correct theme labels', () => {
    render(<App />)
    expect(within(entryRow('Login page is broken')).getByText('Theme: Bug')).toBeInTheDocument()
    expect(within(entryRow('Add dark mode')).getByText('Theme: Feature')).toBeInTheDocument()
    expect(within(entryRow('Button too small')).getByText('Theme: UX')).toBeInTheDocument()
  })

  it('seed entries show correct upvote counts', () => {
    render(<App />)
    expect(within(entryRow('Login page is broken')).getByText('Upvotes: 5')).toBeInTheDocument()
    expect(within(entryRow('Add dark mode')).getByText('Upvotes: 3')).toBeInTheDocument()
    expect(within(entryRow('Button too small')).getByText('Upvotes: 7')).toBeInTheDocument()
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

  it('navigates back to Inbox view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('adds a new feedback entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Search is too slow')
    await u.selectOptions(screen.getByLabelText('Theme'), 'Feature')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Search is too slow')).toBeInTheDocument()
    expect(within(entryRow('Search is too slow')).getByText('Theme: Feature')).toBeInTheDocument()
    expect(within(entryRow('Search is too slow')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('ignores blank note on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    const before = screen.getAllByRole('listitem').length
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getAllByRole('listitem').length).toBe(before)
  })

  it('upvote button increments count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /upvote add dark mode/i }))
    expect(within(entryRow('Add dark mode')).getByText('Upvotes: 4')).toBeInTheDocument()
  })

  it('delete button removes the entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete add dark mode/i }))
    expect(screen.queryByText('Add dark mode')).not.toBeInTheDocument()
  })

  it('sort by Most upvoted puts highest upvote entry first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Upvotes: 7')).toBeInTheDocument()
  })

  it('sort by Newest first puts most recently added entry first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Brand new entry')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Newest first')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Brand new entry')).toBeInTheDocument()
  })

  it('stats show correct total feedback count from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
  })

  it('stats show per-theme counts from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('stats show total upvotes from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 15')).toBeInTheDocument()
  })

  it('stats show Top theme — when no entries remain', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete login page is broken/i }))
    await u.click(screen.getByRole('button', { name: /delete add dark mode/i }))
    await u.click(screen.getByRole('button', { name: /delete button too small/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: —')).toBeInTheDocument()
  })

  it('stats update after adding a new Bug entry (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Another crash')
    await u.selectOptions(screen.getByLabelText('Theme'), 'Bug')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 4')).toBeInTheDocument()
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('stats total upvotes updates after upvoting (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /upvote login page is broken/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 16')).toBeInTheDocument()
  })

  it('stats update after deleting an entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete login page is broken/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 2')).toBeInTheDocument()
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
  })

  it('settings toggle changes data-theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inbox')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('inbox state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Persist me')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })
})
