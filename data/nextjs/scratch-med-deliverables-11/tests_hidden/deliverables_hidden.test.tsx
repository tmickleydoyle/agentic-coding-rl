// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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

describe('Deliverables Tracker (held-out)', () => {
  it('adding two items updates Showing count to 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    await addItem(u, 'Prototype')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('Pending filter count updates when an item is marked delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1')
    await addItem(u, 'P2')
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark delivered/i }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('Delivered filter count updates when an item is marked pending again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Q1')
    await addItem(u, 'Q2')
    await u.click(within(itemRow('Q1')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(itemRow('Q2')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
    await u.click(within(itemRow('Q1')).getByRole('button', { name: /mark pending/i }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('summary Pending and Delivered counts are correct after mixed statuses', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A')
    await addItem(u, 'B')
    await addItem(u, 'C')
    await addItem(u, 'D')
    await u.click(within(itemRow('A')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(itemRow('C')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('summary Total updates after adding items cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item X')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    await nav(u, 'Deliverables')
    await addItem(u, 'Item Y')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
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

  it('whitespace-only item name is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('All filter button has aria-pressed true by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('mark delivered button disappears after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Docs')
    await u.click(within(itemRow('Docs')).getByRole('button', { name: /mark delivered/i }))
    expect(within(itemRow('Docs')).queryByRole('button', { name: /mark delivered/i })).not.toBeInTheDocument()
  })

  it('mark pending button disappears after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Assets')
    await u.click(within(itemRow('Assets')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(itemRow('Assets')).getByRole('button', { name: /mark pending/i }))
    expect(within(itemRow('Assets')).queryByRole('button', { name: /mark pending/i })).not.toBeInTheDocument()
  })
})
