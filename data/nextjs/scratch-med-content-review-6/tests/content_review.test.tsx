import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, reviewer: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.clear(screen.getByLabelText(/reviewer/i))
  await u.type(screen.getByLabelText(/reviewer/i), reviewer)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('Content Review Tracker', () => {
  it('starts on the Reviews view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /reviews \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()
  })

  it('adds an item and shows it with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blog post', 'Alice')
    expect(screen.getByText('Blog post')).toBeInTheDocument()
    expect(within(itemRow('Blog post')).getByText('Status: draft')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /reviews \(1\)/i })).toBeInTheDocument()
  })

  it('ignores adding an item when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/reviewer/i), 'Bob')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /reviews \(0\)/i })).toBeInTheDocument()
  })

  it('ignores adding an item when reviewer is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item title/i), 'My article')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: /reviews \(0\)/i })).toBeInTheDocument()
  })

  it('advances status from draft to approved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Newsletter', 'Carol')
    await u.click(within(itemRow('Newsletter')).getByRole('button', { name: /next status for newsletter/i }))
    expect(within(itemRow('Newsletter')).getByText('Status: approved')).toBeInTheDocument()
  })

  it('advances status from approved to changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Press release', 'Dan')
    await u.click(within(itemRow('Press release')).getByRole('button', { name: /next status for press release/i }))
    await u.click(within(itemRow('Press release')).getByRole('button', { name: /next status for press release/i }))
    expect(within(itemRow('Press release')).getByText('Status: changes')).toBeInTheDocument()
  })

  it('wraps status from changes back to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Whitepaper', 'Eve')
    // draft -> approved -> changes -> draft
    await u.click(within(itemRow('Whitepaper')).getByRole('button', { name: /next status for whitepaper/i }))
    await u.click(within(itemRow('Whitepaper')).getByRole('button', { name: /next status for whitepaper/i }))
    await u.click(within(itemRow('Whitepaper')).getByRole('button', { name: /next status for whitepaper/i }))
    expect(within(itemRow('Whitepaper')).getByText('Status: draft')).toBeInTheDocument()
  })

  it('filters by draft shows only draft items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Article A', 'Frank')
    await addItem(u, 'Article B', 'Grace')
    await u.click(within(itemRow('Article A')).getByRole('button', { name: /next status for article a/i }))
    // Article A is now approved, Article B is draft
    await u.click(screen.getByRole('button', { name: 'draft' }))
    expect(screen.getByRole('heading', { name: /reviews \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Article B')).toBeInTheDocument()
    expect(screen.queryByText('Article A')).not.toBeInTheDocument()
  })

  it('filters by approved shows only approved items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Report X', 'Hank')
    await addItem(u, 'Report Y', 'Iris')
    await u.click(within(itemRow('Report X')).getByRole('button', { name: /next status for report x/i }))
    await u.click(screen.getByRole('button', { name: 'approved' }))
    expect(screen.getByRole('heading', { name: /reviews \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Report X')).toBeInTheDocument()
    expect(screen.queryByText('Report Y')).not.toBeInTheDocument()
  })

  it('All filter shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item One', 'Jack')
    await addItem(u, 'Item Two', 'Kate')
    await u.click(within(itemRow('Item One')).getByRole('button', { name: /next status for item one/i }))
    await u.click(screen.getByRole('button', { name: 'draft' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /reviews \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Item One')).toBeInTheDocument()
    expect(screen.getByText('Item Two')).toBeInTheDocument()
  })

  it('Stats shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc A', 'Leo')
    await addItem(u, 'Doc B', 'Mia')
    await addItem(u, 'Doc C', 'Ned')
    await u.click(within(itemRow('Doc A')).getByRole('button', { name: /next status for doc a/i }))
    // Doc A: approved, Doc B: draft, Doc C: draft
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Approved: 1')).toBeInTheDocument()
    expect(screen.getByText('Changes: 0')).toBeInTheDocument()
  })

  it('Stats shows approved percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', 'Olivia')
    await addItem(u, 'P2', 'Paul')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /next status for p1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Approved: 50%')).toBeInTheDocument()
  })

  it('Stats shows 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
    expect(screen.getByText('Approved: 0%')).toBeInTheDocument()
  })

  it('Stats is not affected by the Reviews filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1', 'Quinn')
    await addItem(u, 'Q2', 'Rita')
    await u.click(within(itemRow('Q1')).getByRole('button', { name: /next status for q1/i }))
    await u.click(screen.getByRole('button', { name: 'approved' }))
    // filter shows 1, but Stats should still show total 2
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 2')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reviews')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item', 'Sam')
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /reviews \(1\)/i })).toBeInTheDocument()
  })

  it('shows reviewer name in the item row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Case study', 'Tara')
    expect(within(itemRow('Case study')).getByText('Tara')).toBeInTheDocument()
  })
})
