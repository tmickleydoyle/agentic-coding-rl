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

  it('navigates back to Inbox after visiting Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('adds a feedback item and shows note, theme badge, and upvote count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Login is broken', 'Bug')
    expect(screen.getByText('Login is broken')).toBeInTheDocument()
    expect(screen.getByText('[Bug]')).toBeInTheDocument()
    expect(screen.getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('ignores a blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryAllByText(/Upvotes:/)).toHaveLength(0)
  })

  it('clears the Note input and resets Theme to Bug after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Theme')).toHaveValue('Bug')
  })

  it('upvotes increment the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Better docs')
    await u.click(screen.getByRole('button', { name: /upvote better docs/i }))
    await u.click(screen.getByRole('button', { name: /upvote better docs/i }))
    expect(within(itemRow('Better docs')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('clear all removes all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item one')
    await addFeedback(u, 'Item two')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryByText('Item one')).not.toBeInTheDocument()
    expect(screen.queryByText('Item two')).not.toBeInTheDocument()
  })

  it('sort by Upvotes reorders items highest first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low votes', 'Bug')
    await addFeedback(u, 'High votes', 'Feature')
    await u.click(screen.getByRole('button', { name: /upvote high votes/i }))
    await u.click(screen.getByRole('button', { name: /upvote high votes/i }))
    await u.click(screen.getByRole('button', { name: /upvote high votes/i }))
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Upvotes')
    const items = screen.getAllByText(/Upvotes: \d+/)
    expect(items[0]).toHaveTextContent('Upvotes: 3')
    expect(items[1]).toHaveTextContent('Upvotes: 0')
  })

  it('stats shows Total feedback count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'Bug')
    await addFeedback(u, 'Two', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 2')).toBeInTheDocument()
  })

  it('stats shows per-theme counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug A', 'Bug')
    await addFeedback(u, 'Bug B', 'Bug')
    await addFeedback(u, 'Feat A', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 0')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('stats shows Top theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Ux 1', 'UX')
    await addFeedback(u, 'Ux 2', 'UX')
    await addFeedback(u, 'Bug 1', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: UX')).toBeInTheDocument()
  })

  it('stats shows Top theme: None when inbox is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('stats shows Total upvotes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Voteable', 'Other')
    await u.click(screen.getByRole('button', { name: /upvote voteable/i }))
    await u.click(screen.getByRole('button', { name: /upvote voteable/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 2')).toBeInTheDocument()
  })

  it('stats Total upvotes is 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
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

  it('inbox state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Feature')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
  })

  it('stats updates after clear all on inbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'To be cleared', 'Bug')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })
})
