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

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inbox (3)' })).toBeInTheDocument()
    expect(screen.getByText('Login page broken')).toBeInTheDocument()
    expect(screen.getByText('Add dark mode')).toBeInTheDocument()
    expect(screen.getByText('Button too small')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Inbox (3)' })).toBeInTheDocument()
  })

  it('shows seed upvote counts', () => {
    render(<App />)
    expect(within(row('Login page broken')).getByText(/Upvotes: 3/)).toBeInTheDocument()
    expect(within(row('Add dark mode')).getByText(/Upvotes: 5/)).toBeInTheDocument()
    expect(within(row('Button too small')).getByText(/Upvotes: 1/)).toBeInTheDocument()
  })

  it('shows seed themes in parentheses', () => {
    render(<App />)
    expect(within(row('Login page broken')).getByText('(Bug)')).toBeInTheDocument()
    expect(within(row('Add dark mode')).getByText('(Feature)')).toBeInTheDocument()
    expect(within(row('Button too small')).getByText('(UX)')).toBeInTheDocument()
  })

  it('adds a new feedback item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Improve onboarding', 'UX')
    expect(screen.getByRole('heading', { name: 'Inbox (4)' })).toBeInTheDocument()
    expect(screen.getByText('Improve onboarding')).toBeInTheDocument()
    expect(within(row('Improve onboarding')).getByText(/Upvotes: 0/)).toBeInTheDocument()
  })

  it('ignores blank note on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Inbox (3)' })).toBeInTheDocument()
  })

  it('upvoting increments the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /upvote button too small/i }))
    expect(within(row('Button too small')).getByText(/Upvotes: 2/)).toBeInTheDocument()
  })

  it('sorts by upvotes descending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /sort by upvotes/i }))
    const listItems = screen.getAllByRole('listitem')
    const notes = listItems.map((li) => li.textContent)
    const addDarkIdx = notes.findIndex((t) => t?.includes('Add dark mode'))
    const loginIdx = notes.findIndex((t) => t?.includes('Login page broken'))
    const buttonIdx = notes.findIndex((t) => t?.includes('Button too small'))
    expect(addDarkIdx).toBeLessThan(loginIdx)
    expect(loginIdx).toBeLessThan(buttonIdx)
  })

  it('stats shows total feedback matching seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 3')).toBeInTheDocument()
  })

  it('stats shows per-theme counts for seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
  })

  it('stats does not show themes with zero items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.queryByText(/^Other:/)).not.toBeInTheDocument()
  })

  it('stats shows most upvoted from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most upvoted: Add dark mode')).toBeInTheDocument()
  })

  it('stats shows total upvotes from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 9')).toBeInTheDocument()
  })

  it('stats updates most upvoted after upvoting (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // upvote "Button too small" enough times to make it top
    for (let i = 0; i < 6; i++) {
      await u.click(screen.getByRole('button', { name: /upvote button too small/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Most upvoted: Button too small')).toBeInTheDocument()
  })

  it('stats updates total feedback after adding item (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Needs search', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 4')).toBeInTheDocument()
    expect(screen.getByText('Feature: 2')).toBeInTheDocument()
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

  it('theme persists when navigating away and back', async () => {
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

  it('clear all feedback empties inbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    expect(screen.getByRole('heading', { name: 'Inbox (0)' })).toBeInTheDocument()
  })

  it('clear all resets stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Most upvoted: —')).toBeInTheDocument()
  })

  it('inbox state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Other')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inbox (4)' })).toBeInTheDocument()
  })
})
