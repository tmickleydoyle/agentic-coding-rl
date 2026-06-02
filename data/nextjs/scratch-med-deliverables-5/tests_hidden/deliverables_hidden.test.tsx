// HELD-OUT generalization tests — fresh scenarios not seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, item: string, due = '') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), item)
  if (due) {
    await u.clear(screen.getByLabelText(/due date/i))
    await u.type(screen.getByLabelText(/due date/i), due)
  }
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function row(item: string): HTMLElement {
  const el = screen.getByText(item).closest('li')
  if (!el) throw new Error(`no row for ${item}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('pending filter with no pending items shows Pending deliverables (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'All done')
    await u.click(within(row('All done')).getByRole('button', { name: /mark delivered all done/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.getByRole('heading', { name: 'Pending deliverables (0)' })).toBeInTheDocument()
    expect(screen.queryByText('All done')).not.toBeInTheDocument()
  })

  it('summary progress rounds correctly for 1 of 3 delivered (33%)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Aa')
    await addItem(u, 'Bb')
    await addItem(u, 'Cc')
    await u.click(within(row('Aa')).getByRole('button', { name: /mark delivered aa/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('summary ignores the pending filter and counts all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X1')
    await addItem(u, 'X2')
    await u.click(within(row('X1')).getByRole('button', { name: /mark delivered x1/i }))
    // switch to pending filter on deliverables view (hides X1)
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    // now go to summary — should still count both
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('can toggle theme dark then back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding item without due date still shows in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'No due date item')
    expect(screen.getByText('No due date item')).toBeInTheDocument()
    expect(within(row('No due date item')).getByText('pending')).toBeInTheDocument()
  })

  it('marking delivered does not affect other rows statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(row('Alpha')).getByRole('button', { name: /mark delivered alpha/i }))
    expect(within(row('Beta')).getByText('pending')).toBeInTheDocument()
    expect(within(row('Beta')).getByRole('button', { name: /mark delivered beta/i })).not.toBeDisabled()
  })

  it('filter resets between navigations do not happen — filter persists on same view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Stay pending')
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.getByRole('heading', { name: 'Pending deliverables (1)' })).toBeInTheDocument()
    // navigate away and back; filter may reset but heading must be consistent with displayed items
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    // after returning, the count shown must match what is visible
    const heading = screen.getByRole('heading', { name: /deliverables \(/ })
    expect(heading).toBeInTheDocument()
  })

  it('whitespace-only item name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^item$/i), '   ')
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByRole('heading', { name: 'All deliverables (0)' })).toBeInTheDocument()
  })
})
