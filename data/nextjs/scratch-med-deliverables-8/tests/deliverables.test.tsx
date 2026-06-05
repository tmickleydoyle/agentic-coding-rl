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
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows zero count summary on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a deliverable with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Design mockup', '2024-11-01')
    expect(screen.getByText('Design mockup')).toBeInTheDocument()
    expect(within(itemRow('Design mockup')).getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('ignores blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/due date/i), '2024-11-01')
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('ignores blank due date', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Something')
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write report', '2024-10-15')
    await u.click(within(itemRow('Write report')).getByRole('button', { name: /mark delivered write report/i }))
    expect(within(itemRow('Write report')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Mark delivered button once already delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Send invoice', '2024-09-30')
    await u.click(within(itemRow('Send invoice')).getByRole('button', { name: /mark delivered send invoice/i }))
    expect(within(itemRow('Send invoice')).getByRole('button', { name: /mark delivered send invoice/i })).toBeDisabled()
  })

  it('deletes a deliverable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old task', '2024-08-01')
    await u.click(within(itemRow('Old task')).getByRole('button', { name: /delete old task/i }))
    expect(screen.queryByText('Old task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('filters to show only pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task A', '2024-12-01')
    await addItem(u, 'Task B', '2024-12-02')
    await u.click(within(itemRow('Task A')).getByRole('button', { name: /mark delivered task a/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.queryByText('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
  })

  it('filters to show only delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha', '2024-12-01')
    await addItem(u, 'Beta', '2024-12-02')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark delivered alpha/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
  })

  it('All filter shows every item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', '2024-12-01')
    await addItem(u, 'Y', '2024-12-02')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark delivered x/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('Y')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1', '2024-12-01')
    await addItem(u, 'P2', '2024-12-02')
    await addItem(u, 'P3', '2024-12-03')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark delivered p1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('Summary delivery rate is 0% with no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 0%')).toBeInTheDocument()
  })

  it('Summary delivery rate computes correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1', '2024-12-01')
    await addItem(u, 'Q2', '2024-12-02')
    await u.click(within(itemRow('Q1')).getByRole('button', { name: /mark delivered q1/i }))
    await u.click(within(itemRow('Q2')).getByRole('button', { name: /mark delivered q2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivery rate: 100%')).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset all deliverables clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1', '2024-12-01')
    await addItem(u, 'Item 2', '2024-12-02')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all deliverables/i }))
    await nav(u, 'Deliverables')
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persist me', '2024-12-31')
    await nav(u, 'Settings')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('Reset reflected in Summary after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp', '2024-12-01')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all deliverables/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivery rate: 0%')).toBeInTheDocument()
  })
})
