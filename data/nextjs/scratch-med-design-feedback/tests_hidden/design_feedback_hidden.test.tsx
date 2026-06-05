// HELD-OUT generalization tests — not seen by the agent. Fresh scenarios.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, scr: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), scr)
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

describe('Design Feedback Tracker (held-out)', () => {
  it('seed items have Mark addressed buttons initially', () => {
    render(<App />)
    const btns = screen.getAllByRole('button', { name: 'Mark addressed' })
    expect(btns.length).toBe(2)
  })

  it('adding two more items raises Open count to 4', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Nav overlap', 'Mobile')
    await addFeedback(u, 'Color mismatch', 'Settings')
    expect(screen.getByText('Open: 4')).toBeInTheDocument()
  })

  it('filter shows all items by default (both seed items visible)', () => {
    render(<App />)
    expect(screen.getByText('Button contrast too low')).toBeInTheDocument()
    expect(screen.getByText('Spacing inconsistent')).toBeInTheDocument()
  })

  it('addressing one seed item then filtering to open hides it', async () => {
    const u = userEvent.setup()
    render(<App />)
    // address first seed item (Button contrast too low)
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    // switch filter to open only
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Open' })).toBeInTheDocument()
    // only the still-open item should show its toggle button
    expect(screen.getAllByRole('button', { name: 'Mark addressed' }).length).toBe(1)
  })

  it('toggling filter back to All reveals addressed item again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await u.click(screen.getByRole('button', { name: 'Show: Open' }))
    expect(screen.getByRole('button', { name: 'Show: All' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Mark addressed' }).length).toBe(1)
    expect(screen.getAllByRole('button', { name: 'Mark open' }).length).toBe(1)
  })

  it('Summary addressed percentage rounds correctly for 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Extra item', 'Onboarding')
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 33%')).toBeInTheDocument()
  })

  it('Summary open count matches feedback view open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    const feedbackOpen = screen.getByText('Open: 1').textContent
    await nav(u, 'Summary')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(feedbackOpen).toBe('Open: 1')
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('dark theme persists to Summary view', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('newly added item appears with Mark addressed button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Link underline missing', 'Footer')
    const items = screen.getAllByRole('button', { name: 'Mark addressed' })
    expect(items.length).toBe(3)
  })

  it('Summary shows 0% with all items open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed: 0%')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
  })

  it('addressing all seed items then adding new one gives correct Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    await u.click(screen.getAllByRole('button', { name: 'Mark addressed' })[0])
    await addFeedback(u, 'Brand new issue', 'Signup')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 67%')).toBeInTheDocument()
  })
})
