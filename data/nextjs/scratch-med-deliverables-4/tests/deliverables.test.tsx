import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2024-12-31') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function getRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows All (0) heading initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'All (0)' })).toBeInTheDocument()
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

  it('navigates back to Deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('adds a deliverable and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Design mockup', '2024-07-01')
    expect(screen.getByText('Design mockup')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All (1)' })).toBeInTheDocument()
  })

  it('new item has status pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write report')
    expect(within(getRow('Write report')).getByText('pending')).toBeInTheDocument()
  })

  it('ignores blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByRole('heading', { name: 'All (0)' })).toBeInTheDocument()
  })

  it('Mark delivered button is enabled for pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Send invoice')
    expect(within(getRow('Send invoice')).getByRole('button', { name: /mark delivered/i })).not.toBeDisabled()
  })

  it('Mark pending button is disabled for pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Review PR')
    expect(within(getRow('Review PR')).getByRole('button', { name: /mark pending/i })).toBeDisabled()
  })

  it('marks an item as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Deploy app')
    await u.click(within(getRow('Deploy app')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Deploy app')).getByText('delivered')).toBeInTheDocument()
  })

  it('Mark delivered is disabled after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Close tickets')
    await u.click(within(getRow('Close tickets')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Close tickets')).getByRole('button', { name: /mark delivered/i })).toBeDisabled()
  })

  it('marks a delivered item back to pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Handoff docs')
    await u.click(within(getRow('Handoff docs')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('Handoff docs')).getByRole('button', { name: /mark pending/i }))
    expect(within(getRow('Handoff docs')).getByText('pending')).toBeInTheDocument()
  })

  it('filter Pending only hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task A')
    await addItem(u, 'Task B')
    await u.click(within(getRow('Task A')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.queryByText('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  it('Pending only heading shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await addItem(u, 'Z')
    await u.click(within(getRow('X')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    expect(screen.getByRole('heading', { name: 'Pending only (2)' })).toBeInTheDocument()
  })

  it('switching back to All restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(getRow('Alpha')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: /pending only/i }))
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    await addItem(u, 'Three')
    await u.click(within(getRow('One')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
  })

  it('Summary shows Delivered: 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('Summary shows Delivered: 50% for half delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P')
    await addItem(u, 'Q')
    await u.click(within(getRow('P')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 50%')).toBeInTheDocument()
  })

  it('Summary shows Delivered: 100% when all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Final')
    await u.click(within(getRow('Final')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 100%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persist me')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('toggles theme in Settings and persists across views', async () => {
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
})
