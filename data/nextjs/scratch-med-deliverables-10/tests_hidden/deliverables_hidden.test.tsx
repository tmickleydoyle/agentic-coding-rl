import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, item: string, due = '2025-01-01') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), item)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function getRow(item: string): HTMLElement {
  const el = screen.getByText(item).closest('li')
  if (!el) throw new Error(`no row for ${item}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('multiple items can be added and all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    await addItem(u, 'Prototype')
    await addItem(u, 'Final assets')
    expect(screen.getByText('Wireframes')).toBeInTheDocument()
    expect(screen.getByText('Prototype')).toBeInTheDocument()
    expect(screen.getByText('Final assets')).toBeInTheDocument()
  })

  it('Summary progress rounds to nearest percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'a')
    await addItem(u, 'b')
    await addItem(u, 'c')
    await u.click(within(getRow('a')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('marking all items delivered shows 100% progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task 1')
    await addItem(u, 'Task 2')
    await u.click(within(getRow('Task 1')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('Task 2')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('Show: Pending filter shows only pending items after mixed state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done one')
    await addItem(u, 'Done two')
    await addItem(u, 'Still pending')
    await u.click(within(getRow('Done one')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('Done two')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.queryByText('Done one')).not.toBeInTheDocument()
    expect(screen.queryByText('Done two')).not.toBeInTheDocument()
    expect(screen.getByText('Still pending')).toBeInTheDocument()
  })

  it('reverting delivered back to pending makes it visible in pending filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Flip me')
    await u.click(within(getRow('Flip me')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.queryByText('Flip me')).not.toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await u.click(within(getRow('Flip me')).getByRole('button', { name: /mark pending/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.getByText('Flip me')).toBeInTheDocument()
  })

  it('filter state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Sticky')
    await u.click(within(getRow('Sticky')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('button', { name: 'Show: Pending' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByText('Sticky')).not.toBeInTheDocument()
  })

  it('Summary Pending count decrements when item is marked delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await addItem(u, 'Gamma')
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
    await nav(u, 'Deliverables')
    await u.click(within(getRow('Alpha')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
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

  it('blank item name with a due date does not add a row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/due date/i), '2025-06-01')
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
