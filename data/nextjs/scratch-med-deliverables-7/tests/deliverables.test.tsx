import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addDeliverable(u: U, name: string, due = '2024-12-31') {
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

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view with count 0', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
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

  it('navigates back to Deliverables view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('adds a deliverable and shows it with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Design mockups', '2024-07-15')
    expect(screen.getByText('Design mockups')).toBeInTheDocument()
    expect(screen.getByText('2024-07-15')).toBeInTheDocument()
    expect(within(itemRow('Design mockups')).getByText('pending')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'API docs')
    await u.click(within(itemRow('API docs')).getByRole('button', { name: /mark api docs delivered/i }))
    expect(within(itemRow('API docs')).getByText('delivered')).toBeInTheDocument()
  })

  it('Mark delivered button is disabled when already delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Release notes')
    await u.click(within(itemRow('Release notes')).getByRole('button', { name: /mark release notes delivered/i }))
    expect(within(itemRow('Release notes')).getByRole('button', { name: /mark release notes delivered/i })).toBeDisabled()
  })

  it('Mark pending button is disabled when status is pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Changelog')
    expect(within(itemRow('Changelog')).getByRole('button', { name: /mark changelog pending/i })).toBeDisabled()
  })

  it('marks delivered then back to pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Prototype')
    await u.click(within(itemRow('Prototype')).getByRole('button', { name: /mark prototype delivered/i }))
    await u.click(within(itemRow('Prototype')).getByRole('button', { name: /mark prototype pending/i }))
    expect(within(itemRow('Prototype')).getByText('pending')).toBeInTheDocument()
  })

  it('filter Show pending hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Done task')
    await addDeliverable(u, 'Open task')
    await u.click(within(itemRow('Done task')).getByRole('button', { name: /mark done task delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
    expect(screen.getByText('Open task')).toBeInTheDocument()
  })

  it('heading count reflects active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Alpha')
    await addDeliverable(u, 'Beta')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark alpha delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('Show all restores all items after filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'X')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark x delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('Summary shows zero stats when empty (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added deliverables (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Report A')
    await addDeliverable(u, 'Report B')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('Summary updates after marking delivered (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Task 1')
    await addDeliverable(u, 'Task 2')
    await u.click(within(itemRow('Task 1')).getByRole('button', { name: /mark task 1 delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 50%')).toBeInTheDocument()
  })

  it('Summary ignores the pending filter — counts all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'P1')
    await addDeliverable(u, 'P2')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark p1 delivered/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'Persisted item', '2025-01-01')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
    expect(screen.getByText('2025-01-01')).toBeInTheDocument()
  })

  it('toggles theme via Settings and data-theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Settings button label updates after theme toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('adds multiple deliverables and count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDeliverable(u, 'D1')
    await addDeliverable(u, 'D2')
    await addDeliverable(u, 'D3')
    expect(screen.getByRole('heading', { name: 'Deliverables (3)' })).toBeInTheDocument()
  })
})
