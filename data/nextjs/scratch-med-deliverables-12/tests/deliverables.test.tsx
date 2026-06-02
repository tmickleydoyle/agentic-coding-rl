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

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view with empty list', () => {
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

  it('navigates back to Deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('adds a deliverable item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Landing page')
    expect(screen.getByText('Landing page')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('ignores an empty item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('shows a new item with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'API docs')
    expect(within(itemRow('API docs')).getByText('pending')).toBeInTheDocument()
  })

  it('shows the due date for an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Design mock', '2024-06-01')
    expect(within(itemRow('Design mock')).getByText('2024-06-01')).toBeInTheDocument()
  })

  it('marks an item as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    await u.click(within(itemRow('Wireframes')).getByRole('button', { name: /mark delivered wireframes/i }))
    expect(within(itemRow('Wireframes')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Mark delivered button once delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Prototype')
    await u.click(within(itemRow('Prototype')).getByRole('button', { name: /mark delivered prototype/i }))
    expect(within(itemRow('Prototype')).getByRole('button', { name: /mark delivered prototype/i })).toBeDisabled()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Temp item')
    await u.click(within(itemRow('Temp item')).getByRole('button', { name: /delete temp item/i }))
    expect(screen.queryByText('Temp item')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (0)' })).toBeInTheDocument()
  })

  it('filter button starts as Show: All', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: All' })).toBeInTheDocument()
  })

  it('toggling filter to Show: Pending hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark delivered alpha/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('button', { name: 'Show: Pending' })).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('heading count reflects visible items when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark delivered x/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('toggling filter back to Show: All restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gamma')
    await u.click(within(itemRow('Gamma')).getByRole('button', { name: /mark delivered gamma/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (1)' })).toBeInTheDocument()
  })

  it('Summary shows zeros when no items exist (cross-view derived state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added and delivered items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    await addItem(u, 'Three')
    await u.click(within(itemRow('One')).getByRole('button', { name: /mark delivered one/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('Summary counts deleted items as gone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'To remove')
    await addItem(u, 'Keeper')
    await u.click(within(itemRow('To remove')).getByRole('button', { name: /delete to remove/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('Summary Progress is 100% when all items delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done1')
    await addItem(u, 'Done2')
    await u.click(within(itemRow('Done1')).getByRole('button', { name: /mark delivered done1/i }))
    await u.click(within(itemRow('Done2')).getByRole('button', { name: /mark delivered done2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('Summary not affected by the pending filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1')
    await addItem(u, 'P2')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark delivered p1/i }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme changes to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Deliverables')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
  })
})
