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

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows Showing 0 of 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Showing 0 of 0')).toBeInTheDocument()
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
    await addItem(u, 'Landing page', '2024-07-01')
    expect(screen.getByText('Landing page')).toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 1')).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByText('Showing 0 of 0')).toBeInTheDocument()
  })

  it('new item starts with status pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    expect(within(itemRow('Wireframes')).getByText('pending')).toBeInTheDocument()
  })

  it('Mark delivered button changes status to delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Copy draft')
    await u.click(within(itemRow('Copy draft')).getByRole('button', { name: /mark delivered copy draft/i }))
    expect(within(itemRow('Copy draft')).getByText('delivered')).toBeInTheDocument()
  })

  it('Mark delivered button is disabled after item is delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Icons')
    await u.click(within(itemRow('Icons')).getByRole('button', { name: /mark delivered icons/i }))
    expect(within(itemRow('Icons')).getByRole('button', { name: /mark delivered icons/i })).toBeDisabled()
  })

  it('Delete button removes the item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Style guide')
    await u.click(within(itemRow('Style guide')).getByRole('button', { name: /delete style guide/i }))
    expect(screen.queryByText('Style guide')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 0 of 0')).toBeInTheDocument()
  })

  it('Pending filter hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark delivered alpha/i }))
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('Showing X of Y reflects the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1')
    await addItem(u, 'P2')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark delivered p1/i }))
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    expect(screen.getByText('Showing 1 of 2')).toBeInTheDocument()
  })

  it('All filter restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark delivered x/i }))
    await u.click(screen.getByRole('button', { name: /^pending$/i }))
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Showing 2 of 2')).toBeInTheDocument()
  })

  it('Summary shows Total, Pending, Delivered counts (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Doc A')
    await addItem(u, 'Doc B')
    await u.click(within(itemRow('Doc A')).getByRole('button', { name: /mark delivered doc a/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('Summary shows Delivered 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('Summary shows Delivered 50% with one of two delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'M1')
    await addItem(u, 'M2')
    await u.click(within(itemRow('M1')).getByRole('button', { name: /mark delivered m1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 50%')).toBeInTheDocument()
  })

  it('Summary shows Delivered 100% when all items are delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Z')
    await u.click(within(itemRow('Z')).getByRole('button', { name: /mark delivered z/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 100%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persist me')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('due date is shown in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Proposal', '2024-08-15')
    expect(within(itemRow('Proposal')).getByText('2024-08-15')).toBeInTheDocument()
  })
})
