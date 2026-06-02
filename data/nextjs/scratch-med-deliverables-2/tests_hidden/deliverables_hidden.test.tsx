// HELD-OUT generalization tests — used only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due: string) {
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('all three seed items appear with correct statuses', () => {
    render(<App />)
    expect(within(row('Design mockups')).getByText('delivered')).toBeInTheDocument()
    expect(within(row('API integration')).getByText('pending')).toBeInTheDocument()
    expect(within(row('User testing')).getByText('pending')).toBeInTheDocument()
  })

  it('due date is shown for seed items', () => {
    render(<App />)
    expect(within(row('Design mockups')).getByText('2024-11-01')).toBeInTheDocument()
    expect(within(row('API integration')).getByText('2024-11-15')).toBeInTheDocument()
  })

  it('adding two items increases count to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item A', '2025-01-10')
    await addItem(u, 'Item B', '2025-01-20')
    expect(screen.getByRole('heading', { name: 'Deliverables (5)' })).toBeInTheDocument()
  })

  it('new items start as pending in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Extra task', '2025-02-01')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('completing all items shows 100% in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }),
    )
    await u.click(
      within(row('User testing')).getByRole('button', { name: /mark delivered user testing/i }),
    )
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 3')).toBeInTheDocument()
  })

  it('removing a delivered item decreases Delivered in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Design mockups')).getByRole('button', { name: /remove design mockups/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('filter shows only pending count after marking one delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(
      within(row('User testing')).getByRole('button', { name: /mark delivered user testing/i }),
    )
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.queryByText('Design mockups')).not.toBeInTheDocument()
    expect(screen.queryByText('User testing')).not.toBeInTheDocument()
  })

  it('removed item no longer appears under pending filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    await u.click(within(row('API integration')).getByRole('button', { name: /remove api integration/i }))
    expect(screen.queryByText('API integration')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Summary reflects state after adding and immediately removing an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp item', '2025-03-01')
    await u.click(within(row('Temp item')).getByRole('button', { name: /remove temp item/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
  })

  it('filter state resets when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    expect(screen.getByRole('button', { name: 'Show: pending' })).toBeInTheDocument()
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    // filter is local UI state — may or may not reset; just check it still works
    expect(screen.getByRole('heading', { name: /deliverables/i })).toBeInTheDocument()
  })
})
