// HELD-OUT generalization tests — fresh scenarios and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addDeliverable(u: U, name: string, due = '2025-03-01') {
  await u.clear(screen.getByLabelText('Item'))
  await u.type(screen.getByLabelText('Item'), name)
  await u.clear(screen.getByLabelText('Due date'))
  await u.type(screen.getByLabelText('Due date'), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('Summary percentage rounds correctly for one of three delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'AA')
    await addDeliverable(u, 'BB')
    await addDeliverable(u, 'CC')
    await u.click(within(itemRow('AA')).getByRole('button', { name: /mark aa delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 33%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Full1')
    await addDeliverable(u, 'Full2')
    await u.click(within(itemRow('Full1')).getByRole('button', { name: /mark full1 delivered/i }))
    await u.click(within(itemRow('Full2')).getByRole('button', { name: /mark full2 delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 100%')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
  })

  it('pending filter shows zero items when all are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Done1')
    await u.click(within(itemRow('Done1')).getByRole('button', { name: /mark done1 delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
    expect(screen.queryByText('Done1')).not.toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'KeepPending')
    await addDeliverable(u, 'MarkDone')
    await u.click(within(itemRow('MarkDone')).getByRole('button', { name: /mark markdone delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    // Should still show only pending
    expect(screen.queryByText('MarkDone')).not.toBeInTheDocument()
    expect(screen.getByText('KeepPending')).toBeInTheDocument()
  })

  it('Mark pending re-enables after toggling to delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Toggle me')
    // Initially Mark pending is disabled
    expect(within(itemRow('Toggle me')).getByRole('button', { name: /mark toggle me pending/i })).toBeDisabled()
    await u.click(within(itemRow('Toggle me')).getByRole('button', { name: /mark toggle me delivered/i }))
    // Now Mark pending should be enabled
    expect(within(itemRow('Toggle me')).getByRole('button', { name: /mark toggle me pending/i })).not.toBeDisabled()
  })

  it('due date is stored and displayed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Sprint review', '2024-09-20')
    expect(within(itemRow('Sprint review')).getByText('2024-09-20')).toBeInTheDocument()
  })

  it('theme toggles twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('cross-view: Summary Pending count drops when item is marked delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Pending item')
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    await nav(u, 'Deliverables')
    await u.click(within(itemRow('Pending item')).getByRole('button', { name: /mark pending item delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })
})
