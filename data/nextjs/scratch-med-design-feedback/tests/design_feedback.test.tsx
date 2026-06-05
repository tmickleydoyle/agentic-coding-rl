import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screen_: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screen_)
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

describe('Design Feedback Tracker', () => {
  it('starts on Feedback view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
    expect(screen.getByText('Button contrast too low')).toBeInTheDocument()
    expect(screen.getByText('Spacing inconsistent')).toBeInTheDocument()
  })

  it('shows seed item screen names', () => {
    render(<App />)
    expect(screen.getByText('Screen: Login')).toBeInTheDocument()
    expect(screen.getByText('Screen: Dashboard')).toBeInTheDocument()
  })

  it('shows Open: 2 initially', () => {
    render(<App />)
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('navigates to Summary and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Feedback')
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new feedback item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Icon too small', 'Profile')
    expect(screen.getByText('Icon too small')).toBeInTheDocument()
    expect(screen.getByText('Screen: Profile')).toBeInTheDocument()
  })

  it('open count increments after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Typo in header', 'Home')
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
  })

  it('ignores add when Note is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Screen'))
    await u.type(screen.getByLabelText('Screen'), 'Checkout')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('ignores add when Screen is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Note'))
    await u.type(screen.getByLabelText('Note'), 'Broken layout')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('marks an item as addressed and open count decreases', async () => {
    const u = userEvent.setup()
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: 'Mark addressed' })
    await u.click(buttons[0])
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('toggling addressed shows Mark open button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = screen.getAllByRole('button', { name: 'Mark addressed' })[0]
    await u.click(btn)
    expect(screen.getAllByRole('button', { name: 'Mark open' }).length).toBeGreaterThan(0)
  })

  it('mark open restores open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const markAddressed = screen.getAllByRole('button', { name: 'Mark addressed' })[0]
    await u.click(markAddressed)
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    const markOpen = screen.getAllByRole('button', { name: 'Mark open' })[0]
    await u.click(markOpen)
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('filter button starts as Show: All', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: All' })).toBeInTheDocument()
  })

  it('clicking filter toggles to Show: Open and hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    const markAddressed = screen.getAllByRole('button', { name: 'Mark addressed' })[0]
    await u.click(markAddressed)
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Open' })).toBeInTheDocument()
    // addressed item should be hidden, open item visible
    expect(screen.getAllByRole('button', { name: 'Mark addressed' }).length).toBe(1)
    expect(screen.queryByRole('button', { name: 'Mark open' })).not.toBeInTheDocument()
  })

  it('open count header is unchanged regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('Summary shows correct totals with seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0%')).toBeInTheDocument()
  })

  it('Summary reflects addressed status (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 50%')).toBeInTheDocument()
  })

  it('Summary updates after adding a new item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Wrong font', 'Header')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 3')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btns = screen.getAllByRole('button', { name: 'Mark addressed' })
    for (let i = 0; i < btns.length; i++) {
      await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed: 100%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Feedback')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Cart')
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
    expect(screen.getByText('Screen: Cart')).toBeInTheDocument()
  })
})
