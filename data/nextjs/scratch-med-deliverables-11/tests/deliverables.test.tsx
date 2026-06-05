import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '') {
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  if (due) {
    await u.clear(screen.getByLabelText(/due date/i))
    await u.type(screen.getByLabelText(/due date/i), due)
  }
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows an empty list initially with Showing: 0 items', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('adds a deliverable and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Design mockups', '2024-06-01')
    expect(screen.getByText('Design mockups')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('new deliverable starts as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write report')
    expect(within(itemRow('Write report')).getByText('pending')).toBeInTheDocument()
    expect(within(itemRow('Write report')).getByRole('button', { name: /mark delivered/i })).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Send invoice')
    await u.click(within(itemRow('Send invoice')).getByRole('button', { name: /mark delivered/i }))
    expect(within(itemRow('Send invoice')).getByText('delivered')).toBeInTheDocument()
    expect(within(itemRow('Send invoice')).getByRole('button', { name: /mark pending/i })).toBeInTheDocument()
  })

  it('marks a delivered item back to pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft contract')
    await u.click(within(itemRow('Draft contract')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(itemRow('Draft contract')).getByRole('button', { name: /mark pending/i }))
    expect(within(itemRow('Draft contract')).getByText('pending')).toBeInTheDocument()
  })

  it('filters to Pending only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('filters to Delivered only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(itemRow('Beta')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('All filter shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('Y')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('button', { name: 'Pending' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('summary shows 0% when no deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('summary reflects cross-view state after adding items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task A')
    await addItem(u, 'Task B')
    await addItem(u, 'Task C')
    await u.click(within(itemRow('Task A')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('summary shows 100% when all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Only task')
    await u.click(within(itemRow('Only task')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('deliverables list state persists across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Deliverables')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('due date is displayed on the item row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Milestone', '2024-12-31')
    expect(within(itemRow('Milestone')).getByText('2024-12-31')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item 1')
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('button', { name: 'Delivered' })).toHaveAttribute('aria-pressed', 'true')
  })
})
