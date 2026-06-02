import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme?: string) {
  await u.clear(screen.getByLabelText(/^note$/i))
  await u.type(screen.getByLabelText(/^note$/i), note)
  if (theme) {
    await u.selectOptions(screen.getByLabelText(/^theme$/i), theme)
  }
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function row(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for "${note}"`)
  return el as HTMLElement
}

describe('Feedback Inbox app', () => {
  it('starts on the Inbox view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /feedback \(0\)/i })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /feedback \(0\)/i })).toBeInTheDocument()
  })

  it('adds a feedback item and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Login page is broken', 'Bug')
    expect(screen.getByRole('heading', { name: /feedback \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Login page is broken')).toBeInTheDocument()
  })

  it('ignores a blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: /feedback \(0\)/i })).toBeInTheDocument()
  })

  it('shows theme badge on feedback item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    expect(within(row('Dark mode please')).getByText('Feature')).toBeInTheDocument()
  })

  it('shows initial upvotes as Upvotes: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Needs search', 'UX')
    expect(within(row('Needs search')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('upvotes increment the count on the item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Better onboarding')
    await u.click(within(row('Better onboarding')).getByRole('button', { name: /upvote better onboarding/i }))
    expect(within(row('Better onboarding')).getByText('Upvotes: 1')).toBeInTheDocument()
    await u.click(within(row('Better onboarding')).getByRole('button', { name: /upvote better onboarding/i }))
    expect(within(row('Better onboarding')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('newest sort shows most recent item first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First item', 'Bug')
    await addFeedback(u, 'Second item', 'Feature')
    await u.selectOptions(screen.getByLabelText(/sort by/i), 'Newest')
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('Second item')
    expect(listItems[1]).toHaveTextContent('First item')
  })

  it('most upvoted sort orders by upvotes descending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Low votes', 'Bug')
    await addFeedback(u, 'High votes', 'Feature')
    await u.click(within(row('High votes')).getByRole('button', { name: /upvote high votes/i }))
    await u.click(within(row('High votes')).getByRole('button', { name: /upvote high votes/i }))
    await u.selectOptions(screen.getByLabelText(/sort by/i), 'Most upvoted')
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('High votes')
    expect(listItems[1]).toHaveTextContent('Low votes')
  })

  it('stats shows total feedback count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue A', 'Bug')
    await addFeedback(u, 'Issue B', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 2')).toBeInTheDocument()
  })

  it('stats shows per-theme counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug one', 'Bug')
    await addFeedback(u, 'Bug two', 'Bug')
    await addFeedback(u, 'Feature one', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 0')).toBeInTheDocument()
  })

  it('stats shows total upvotes reflecting upvote actions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Vote me', 'UX')
    await u.click(within(row('Vote me')).getByRole('button', { name: /upvote vote me/i }))
    await u.click(within(row('Vote me')).getByRole('button', { name: /upvote vote me/i }))
    await u.click(within(row('Vote me')).getByRole('button', { name: /upvote vote me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('stats shows top theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug A', 'Bug')
    await addFeedback(u, 'Bug B', 'Bug')
    await addFeedback(u, 'Feature A', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('stats shows top theme None when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('stats shows top theme None when tied', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug A', 'Bug')
    await addFeedback(u, 'Feature A', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: None')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('inbox state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'UX')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /feedback \(1\)/i })).toBeInTheDocument()
  })

  it('sort order persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Bug')
    await u.selectOptions(screen.getByLabelText(/sort by/i), 'Most upvoted')
    await nav(u, 'Settings')
    await nav(u, 'Inbox')
    expect(screen.getByLabelText(/sort by/i)).toHaveValue('most-upvoted')
  })
})
