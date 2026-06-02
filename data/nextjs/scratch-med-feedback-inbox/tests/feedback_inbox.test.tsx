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

  it('shows Total feedback: 0 on empty inbox', () => {
    render(<App />)
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })

  it('adds feedback and shows it in the list', async () => {
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

  it('resets note input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Some note', 'UX')
    expect(screen.getByLabelText(/^note$/i)).toHaveValue('')
  })

  it('resets theme select to Bug after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Dark mode please', 'Feature')
    expect(screen.getByLabelText(/^theme$/i)).toHaveValue('Bug')
  })

  it('shows Upvotes: 0 for a new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'New item')
    expect(within(feedbackRow('New item')).getByText('Upvotes: 0')).toBeInTheDocument()
  })

  it('upvotes increment the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Make it faster')
    await u.click(within(feedbackRow('Make it faster')).getByRole('button', { name: /upvote make it faster/i }))
    await u.click(within(feedbackRow('Make it faster')).getByRole('button', { name: /upvote make it faster/i }))
    expect(within(feedbackRow('Make it faster')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('sorts by Most upvoted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha')
    await addFeedback(u, 'Beta')
    await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.click(within(feedbackRow('Beta')).getByRole('button', { name: /upvote beta/i }))
    await u.selectOptions(screen.getByLabelText(/^sort by$/i), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Beta')).toBeInTheDocument()
    expect(within(items[1]).getByText('Alpha')).toBeInTheDocument()
  })

  it('newest sort shows most-recently-added first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First')
    await addFeedback(u, 'Second')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Second')).toBeInTheDocument()
    expect(within(items[1]).getByText('First')).toBeInTheDocument()
  })

  it('stats show Total: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })

  it('stats reflect added items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Crash on save', 'Bug')
    await addFeedback(u, 'Add export', 'Feature')
    await addFeedback(u, 'Button too small', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Bug: 1')).toBeInTheDocument()
    expect(screen.getByText('Feature: 1')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('stats reflect upvotes (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Slow load', 'Bug')
    await u.click(within(feedbackRow('Slow load')).getByRole('button', { name: /upvote slow load/i }))
    await u.click(within(feedbackRow('Slow load')).getByRole('button', { name: /upvote slow load/i }))
    await u.click(within(feedbackRow('Slow load')).getByRole('button', { name: /upvote slow load/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top upvotes: 3')).toBeInTheDocument()
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('top upvotes is 0 when inbox is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Top upvotes: 0')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
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
    await addFeedback(u, 'Persisted feedback', 'Other')
    await nav(u, 'Stats')
    await nav(u, 'Inbox')
    expect(screen.getByText('Persisted feedback')).toBeInTheDocument()
    expect(screen.getByText('Total feedback: 1')).toBeInTheDocument()
  })

  it('multiple themes counted correctly in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bug one', 'Bug')
    await addFeedback(u, 'Bug two', 'Bug')
    await addFeedback(u, 'Other thing', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 2')).toBeInTheDocument()
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })
})
