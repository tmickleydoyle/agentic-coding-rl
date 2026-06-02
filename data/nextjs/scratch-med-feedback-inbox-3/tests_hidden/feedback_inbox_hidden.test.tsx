// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, theme?: string) {
  await u.clear(screen.getByLabelText(/^note$/i))
  await u.type(screen.getByLabelText(/^note$/i), note)
  if (theme) await u.selectOptions(screen.getByLabelText(/^theme$/i), theme)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function row(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for "${note}"`)
  return el as HTMLElement
}

describe('Feedback Inbox (held-out)', () => {
  it('adds three items and heading shows Feedback (3)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Bug')
    await addFeedback(u, 'Beta', 'Feature')
    await addFeedback(u, 'Gamma', 'UX')
    expect(screen.getByRole('heading', { name: /feedback \(3\)/i })).toBeInTheDocument()
  })

  it('upvoting multiple items increments each independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item X', 'Bug')
    await addFeedback(u, 'Item Y', 'Feature')
    await u.click(within(row('Item X')).getByRole('button', { name: /upvote item x/i }))
    await u.click(within(row('Item Y')).getByRole('button', { name: /upvote item y/i }))
    await u.click(within(row('Item Y')).getByRole('button', { name: /upvote item y/i }))
    expect(within(row('Item X')).getByText('Upvotes: 1')).toBeInTheDocument()
    expect(within(row('Item Y')).getByText('Upvotes: 2')).toBeInTheDocument()
  })

  it('total upvotes in stats sums across multiple items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'P', 'Bug')
    await addFeedback(u, 'Q', 'UX')
    await u.click(within(row('P')).getByRole('button', { name: /upvote p/i }))
    await u.click(within(row('Q')).getByRole('button', { name: /upvote q/i }))
    await u.click(within(row('Q')).getByRole('button', { name: /upvote q/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 3')).toBeInTheDocument()
  })

  it('stats shows zero total feedback on first load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
  })

  it('stats shows zero upvotes when nothing is upvoted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'No votes yet', 'Feature')
    await nav(u, 'Stats')
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
  })

  it('most-upvoted sort puts highest-upvoted item first after tie-breaking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Contender A', 'Bug')
    await addFeedback(u, 'Contender B', 'Feature')
    await addFeedback(u, 'Contender C', 'UX')
    await u.click(within(row('Contender C')).getByRole('button', { name: /upvote contender c/i }))
    await u.click(within(row('Contender C')).getByRole('button', { name: /upvote contender c/i }))
    await u.click(within(row('Contender C')).getByRole('button', { name: /upvote contender c/i }))
    await u.click(within(row('Contender A')).getByRole('button', { name: /upvote contender a/i }))
    await u.selectOptions(screen.getByLabelText(/sort by/i), 'Most upvoted')
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('Contender C')
  })

  it('top theme updates after adding more items to a different theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'B1', 'Bug')
    await addFeedback(u, 'U1', 'UX')
    await addFeedback(u, 'U2', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: UX')).toBeInTheDocument()
  })

  it('theme toggle toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats UX count increments when UX items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'UX thing 1', 'UX')
    await addFeedback(u, 'UX thing 2', 'UX')
    await nav(u, 'Stats')
    expect(screen.getByText('UX: 2')).toBeInTheDocument()
  })

  it('newest sort lists items newest first by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Older item', 'Bug')
    await addFeedback(u, 'Newer item', 'Feature')
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[0]).toHaveTextContent('Newer item')
  })

  it('all three theme options are available in the dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    const themeSelect = screen.getByLabelText(/^theme$/i)
    await u.selectOptions(themeSelect, 'Bug')
    expect(themeSelect).toHaveValue('Bug')
    await u.selectOptions(themeSelect, 'Feature')
    expect(themeSelect).toHaveValue('Feature')
    await u.selectOptions(themeSelect, 'UX')
    expect(themeSelect).toHaveValue('UX')
  })
})
