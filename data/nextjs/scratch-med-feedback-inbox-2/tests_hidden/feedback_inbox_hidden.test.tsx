// HELD-OUT generalization tests — fresh cross-view scenarios and edge cases
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

async function addFeedback(u: U, note: string, theme: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.selectOptions(screen.getByLabelText('Theme'), theme)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Feedback Inbox (held-out)', () => {
  it('new item starts with Upvotes: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Test zero', 'Bug')
    expect(within(row('Test zero')).getByText(/Upvotes: 0/)).toBeInTheDocument()
  })

  it('adding Other-theme item makes it appear in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Random request', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
  })

  it('multiple upvotes accumulate correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (let i = 0; i < 4; i++) {
      await u.click(screen.getByRole('button', { name: /upvote login page broken/i }))
    }
    expect(within(row('Login page broken')).getByText(/Upvotes: 7/)).toBeInTheDocument()
  })

  it('total upvotes in stats updates after upvoting', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /upvote add dark mode/i }))
    await u.click(screen.getByRole('button', { name: /upvote add dark mode/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 11')).toBeInTheDocument()
  })

  it('adding two Bug items shows Bug: 2 in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Second bug', 'Bug')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
  })

  it('sort by upvotes places highest-upvoted first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Zero votes item', 'Other')
    await u.click(screen.getByRole('button', { name: /sort by upvotes/i }))
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0].textContent).toMatch(/Add dark mode/)
  })

  it('inbox count updates after adding two items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item alpha', 'Feature')
    await addFeedback(u, 'Item beta', 'UX')
    expect(screen.getByRole('heading', { name: 'Inbox (5)' })).toBeInTheDocument()
  })

  it('clear all then add new item shows count of 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    await addFeedback(u, 'Fresh start', 'Feature')
    expect(screen.getByRole('heading', { name: 'Inbox (1)' })).toBeInTheDocument()
  })

  it('clear all then check stats shows no theme rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Stats')
    expect(screen.queryByText(/^Bug:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Feature:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^UX:/)).not.toBeInTheDocument()
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

  it('upvoting a new item reflects in most upvoted stat when highest', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'New champion', 'Feature')
    for (let i = 0; i < 10; i++) {
      await u.click(screen.getByRole('button', { name: /upvote new champion/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Most upvoted: New champion')).toBeInTheDocument()
  })

  it('whitespace-only note is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), '   ')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Inbox (3)' })).toBeInTheDocument()
  })
})
