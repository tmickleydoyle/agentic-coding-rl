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
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function itemRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Deliverables Tracker (held-out)', () => {
  it('adding two items updates the heading count to 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Report A')
    await addItem(u, 'Report B')
    expect(screen.getByRole('heading', { name: 'Deliverables (2)' })).toBeInTheDocument()
  })

  it('blank item name with whitespace only is ignored', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('mark delivered updates status text in row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Milestone 1')
    expect(within(itemRow('Milestone 1')).getByText('pending')).toBeInTheDocument()
    await u.click(within(itemRow('Milestone 1')).getByRole('button', { name: /mark delivered milestone 1/i }))
    expect(within(itemRow('Milestone 1')).getByText('delivered')).toBeInTheDocument()
    expect(within(itemRow('Milestone 1')).queryByText('pending')).not.toBeInTheDocument()
  })

  it('deleting one of multiple items leaves others intact', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Keep me')
    await addItem(u, 'Delete me')
    await u.click(within(itemRow('Delete me')).getByRole('button', { name: /delete delete me/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('filter shows only pending items and hides all delivered ones', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Pending task')
    await addItem(u, 'Done task')
    await u.click(within(itemRow('Done task')).getByRole('button', { name: /mark delivered done task/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByText('Pending task')).toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
  })

  it('heading count is 0 when filter is pending and all items are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Closed')
    await u.click(within(itemRow('Closed')).getByRole('button', { name: /mark delivered closed/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('toggling filter off while on pending view restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item X')
    await addItem(u, 'Item Y')
    await u.click(within(itemRow('Item X')).getByRole('button', { name: /mark delivered item x/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.getByText('Item X')).toBeInTheDocument()
    expect(screen.getByText('Item Y')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (2)' })).toBeInTheDocument()
  })

  it('Summary shows 50% progress for 1 of 2 delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Half1')
    await addItem(u, 'Half2')
    await u.click(within(itemRow('Half1')).getByRole('button', { name: /mark delivered half1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('Summary Pending count goes down after marking items delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'T1')
    await addItem(u, 'T2')
    await addItem(u, 'T3')
    await u.click(within(itemRow('T1')).getByRole('button', { name: /mark delivered t1/i }))
    await u.click(within(itemRow('T2')).getByRole('button', { name: /mark delivered t2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('Summary updates after deleting a delivered item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Removable')
    await addItem(u, 'Stable')
    await u.click(within(itemRow('Removable')).getByRole('button', { name: /mark delivered removable/i }))
    await u.click(within(itemRow('Removable')).getByRole('button', { name: /delete removable/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('theme dark persists into Summary view', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'StayPending')
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('button', { name: 'Show: Pending' })).toBeInTheDocument()
    expect(screen.getByText('StayPending')).toBeInTheDocument()
  })
})
