// HELD-OUT generalization tests — fresh sequences and edge cases not seen during generation.
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

describe('Feedback Inbox (held-out)', () => {
  it('Theme select has all four options', () => {
    render(<App />)
    const select = screen.getByLabelText('Theme') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toContain('Bug')
    expect(options).toContain('Feature')
    expect(options).toContain('UX')
    expect(options).toContain('Other')
  })

  it('adding three items increments count to 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Bug')
    await addFeedback(u, 'Beta', 'Feature')
    await addFeedback(u, 'Gamma', 'Other')
    expect(screen.getByText('Feedback: 3')).toBeInTheDocument()
  })

  it('item with most upvotes moves to top of list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First added', 'UX')
    await addFeedback(u, 'Second added', 'Bug')
    // give Second added 3 upvotes
    for (let i = 0; i < 3; i++) {
      await u.click(within(itemRow('Second added')).getByRole('button', { name: /upvote second added/i }))
    }
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('Second added')
  })

  it('Stats top item updates when upvotes change (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Old winner', 'Feature')
    await addFeedback(u, 'New winner', 'Bug')
    await u.click(within(itemRow('Old winner')).getByRole('button', { name: /upvote old winner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top item: Old winner')).toBeInTheDocument()
    await nav(u, 'Inbox')
    // give New winner 2 upvotes to overtake
    await u.click(within(itemRow('New winner')).getByRole('button', { name: /upvote new winner/i }))
    await u.click(within(itemRow('New winner')).getByRole('button', { name: /upvote new winner/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Top item: New winner')).toBeInTheDocument()
  })

  it('Other theme count increments correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Misc item one', 'Other')
    await addFeedback(u, 'Misc item two', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 2')).toBeInTheDocument()
  })

  it('clear all and re-add shows correct Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Old item', 'Bug')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all feedback/i }))
    await nav(u, 'Inbox')
    await addFeedback(u, 'Fresh start', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Bug: 0')).toBeInTheDocument()
    expect(screen.getByText('UX: 1')).toBeInTheDocument()
    expect(screen.getByText('Top item: Fresh start')).toBeInTheDocument()
  })

  it('upvote count shown inline on each item row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Check upvotes', 'Feature')
    await u.click(within(itemRow('Check upvotes')).getByRole('button', { name: /upvote check upvotes/i }))
    await u.click(within(itemRow('Check upvotes')).getByRole('button', { name: /upvote check upvotes/i }))
    await u.click(within(itemRow('Check upvotes')).getByRole('button', { name: /upvote check upvotes/i }))
    expect(within(itemRow('Check upvotes')).getByText('Upvotes: 3')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('whitespace-only note is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), '   ')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Feedback: 0')).toBeInTheDocument()
  })
})
