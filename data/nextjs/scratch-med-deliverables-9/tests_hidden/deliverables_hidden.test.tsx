// HELD-OUT generalization tests — fresh scenarios different enough to catch hardcoding.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2025-01-01') {
  await u.clear(screen.getByLabelText('Item'))
  await u.type(screen.getByLabelText('Item'), name)
  await u.clear(screen.getByLabelText('Due date'))
  await u.type(screen.getByLabelText('Due date'), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('due date appears in the item row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spec doc', '2025-03-20')
    expect(within(itemRow('Spec doc')).getByText('2025-03-20')).toBeInTheDocument()
  })

  it('adding two items shows Delivered: 0 of 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    expect(screen.getByText('Delivered: 0 of 2')).toBeInTheDocument()
  })

  it('marking both of two items delivered shows Delivered: 2 of 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'AA')
    await addItem(u, 'BB')
    await u.click(within(itemRow('AA')).getByRole('button', { name: /mark delivered aa/i }))
    await u.click(within(itemRow('BB')).getByRole('button', { name: /mark delivered bb/i }))
    expect(screen.getByText('Delivered: 2 of 2')).toBeInTheDocument()
  })

  it('deleting a delivered item updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deletable')
    await addItem(u, 'Keeper')
    await u.click(within(itemRow('Deletable')).getByRole('button', { name: /mark delivered deletable/i }))
    await u.click(within(itemRow('Deletable')).getByRole('button', { name: /delete deletable/i }))
    expect(screen.getByText('Delivered: 0 of 1')).toBeInTheDocument()
  })

  it('Summary Pending count reflects marks correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'R1')
    await addItem(u, 'R2')
    await addItem(u, 'R3')
    await u.click(within(itemRow('R1')).getByRole('button', { name: /mark delivered r1/i }))
    await u.click(within(itemRow('R2')).getByRole('button', { name: /mark delivered r2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary updates after a delete cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'ToDelete')
    await addItem(u, 'ToKeep')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    await nav(u, 'Deliverables')
    await u.click(within(itemRow('ToDelete')).getByRole('button', { name: /delete todelete/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('Show pending hides multiple delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'D1')
    await addItem(u, 'D2')
    await addItem(u, 'P1')
    await u.click(within(itemRow('D1')).getByRole('button', { name: /mark delivered d1/i }))
    await u.click(within(itemRow('D2')).getByRole('button', { name: /mark delivered d2/i }))
    await u.click(screen.getByRole('button', { name: 'Show pending' }))
    expect(screen.queryByText('D1')).not.toBeInTheDocument()
    expect(screen.queryByText('D2')).not.toBeInTheDocument()
    expect(screen.getByText('P1')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'FilterMe')
    await u.click(within(itemRow('FilterMe')).getByRole('button', { name: /mark delivered filterme/i }))
    await u.click(screen.getByRole('button', { name: 'Show pending' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    // FilterMe was delivered and filter is still pending, so it should be hidden
    expect(screen.queryByText('FilterMe')).not.toBeInTheDocument()
  })

  it('theme toggle applies data-theme dark and back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('item status shows as pending initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Fresh item')
    expect(within(itemRow('Fresh item')).getByText('pending')).toBeInTheDocument()
  })

  it('item status changes to delivered after marking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task Z')
    await u.click(within(itemRow('Task Z')).getByRole('button', { name: /mark delivered task z/i }))
    expect(within(itemRow('Task Z')).getByText('delivered')).toBeInTheDocument()
  })
})
