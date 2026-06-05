// HELD-OUT generalization tests — fresh scenarios and edge cases not in the visible suite.
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
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function itemRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`No row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('adding three items gives Showing 3 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item A')
    await addItem(u, 'Item B')
    await addItem(u, 'Item C')
    expect(screen.getByText('Showing 3 of 3')).toBeInTheDocument()
  })

  it('Pending filter with all items pending shows Showing N of N', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    expect(screen.getByText('Showing 2 of 2')).toBeInTheDocument()
  })

  it('Pending filter with all delivered shows Showing 0 of N', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task 1')
    await addItem(u, 'Task 2')
    await u.click(within(itemRow('Task 1')).getByRole('button', { name: /mark delivered task 1/i }))
    await u.click(within(itemRow('Task 2')).getByRole('button', { name: /mark delivered task 2/i }))
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    expect(screen.getByText('Showing 0 of 2')).toBeInTheDocument()
  })

  it('deleting an item updates the Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep')
    await addItem(u, 'Remove')
    await u.click(within(itemRow('Remove')).getByRole('button', { name: /delete remove/i }))
    expect(screen.getByText('Showing 1 of 1')).toBeInTheDocument()
  })

  it('Summary Pending count decrements after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc X')
    await addItem(u, 'Doc Y')
    await addItem(u, 'Doc Z')
    await u.click(within(itemRow('Doc X')).getByRole('button', { name: /mark delivered doc x/i }))
    await u.click(within(itemRow('Doc Y')).getByRole('button', { name: /mark delivered doc y/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
  })

  it('Summary shows 33% for one of three delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'R1')
    await addItem(u, 'R2')
    await addItem(u, 'R3')
    await u.click(within(itemRow('R1')).getByRole('button', { name: /mark delivered r1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 33%')).toBeInTheDocument()
  })

  it('deleting item updates Summary total', async () => {
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

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('item without due date shows empty due in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'NoDue')
    const row = itemRow('NoDue')
    expect(within(row).getByText('pending')).toBeInTheDocument()
    expect(within(row).getByText('NoDue')).toBeInTheDocument()
  })

  it('filter state is independent of marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'FilterA')
    await addItem(u, 'FilterB')
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    await u.click(within(itemRow('FilterA')).getByRole('button', { name: /mark delivered filtera/i }))
    // FilterA is now delivered and should disappear under Pending filter
    expect(screen.queryByText('FilterA')).not.toBeInTheDocument()
    expect(screen.getByText('FilterB')).toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 2')).toBeInTheDocument()
  })
})
