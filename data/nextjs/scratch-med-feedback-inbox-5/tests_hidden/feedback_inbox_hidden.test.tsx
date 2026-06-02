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

describe('Feedback Inbox (held-out)', () => {
  it('upvoting multiple times accumulates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /upvote button too small/i }))
    await u.click(screen.getByRole('button', { name: /upvote button too small/i }))
    expect(within(entryRow('Button too small')).getByText('Upvotes: 9')).toBeInTheDocument()
  })

  it('adding two Bug entries makes Bug the top theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const note of ['Crash on start', 'Null pointer error']) {
      await u.clear(screen.getByLabelText('Note'))
      await u.type(screen.getByLabelText('Note'), note)
      await u.selectOptions(screen.getByLabelText('Theme'), 'Bug')
      await u.click(screen.getByRole('button', { name: /add feedback/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Bug: 3')).toBeInTheDocument()
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('top theme tie-breaks to Bug before Feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Delete seed UX and Feature to leave 1 Bug, then add 1 Feature => tie Bug vs Feature
    await u.click(screen.getByRole('button', { name: /delete add dark mode/i }))
    await u.click(screen.getByRole('button', { name: /delete button too small/i }))
    // now: 1 Bug, 0 Feature
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'New feature idea')
    await u.selectOptions(screen.getByLabelText('Theme'), 'Feature')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    // now: 1 Bug, 1 Feature — tie should pick Bug
    await nav(u, 'Stats')
    expect(screen.getByText('Top theme: Bug')).toBeInTheDocument()
  })

  it('most upvoted sort order is stable after upvoting', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Button too small has 7, login has 5, dark mode has 3
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Most upvoted')
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Button too small')).toBeInTheDocument()
    // upvote login 3 times so it ties at 8 but button too small should stay ahead initially
    await u.click(screen.getByRole('button', { name: /upvote login page is broken/i }))
    await u.click(screen.getByRole('button', { name: /upvote login page is broken/i }))
    await u.click(screen.getByRole('button', { name: /upvote login page is broken/i }))
    // login now 8, button too small 7
    const items2 = screen.getAllByRole('listitem')
    expect(within(items2[0]).getByText('Login page is broken')).toBeInTheDocument()
  })

  it('total upvotes in stats reflects upvotes on newly added entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Extra thing')
    await u.selectOptions(screen.getByLabelText('Theme'), 'Other')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    await u.click(screen.getByRole('button', { name: /upvote extra thing/i }))
    await nav(u, 'Stats')
    // seed total: 5+3+7=15, plus 1 new upvote = 16
    expect(screen.getByText('Total upvotes: 16')).toBeInTheDocument()
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
  })

  it('deleting all entries leaves total feedback 0 and top theme dash', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete login page is broken/i }))
    await u.click(screen.getByRole('button', { name: /delete add dark mode/i }))
    await u.click(screen.getByRole('button', { name: /delete button too small/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
    expect(screen.getByText('Total upvotes: 0')).toBeInTheDocument()
    expect(screen.getByText('Top theme: —')).toBeInTheDocument()
  })

  it('new Other entry appears with Theme: Other label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Miscellaneous issue')
    await u.selectOptions(screen.getByLabelText('Theme'), 'Other')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(within(entryRow('Miscellaneous issue')).getByText('Theme: Other')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('newest first sort shows newly added entry at top', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Sort by'), 'Newest first')
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Very latest')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('Very latest')).toBeInTheDocument()
  })

  it('stats Feature count updates after adding two Feature entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const note of ['Feature one', 'Feature two']) {
      await u.clear(screen.getByLabelText('Note'))
      await u.type(screen.getByLabelText('Note'), note)
      await u.selectOptions(screen.getByLabelText('Theme'), 'Feature')
      await u.click(screen.getByRole('button', { name: /add feedback/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Feature: 3')).toBeInTheDocument()
    expect(screen.getByText('Total feedback: 5')).toBeInTheDocument()
  })
})
