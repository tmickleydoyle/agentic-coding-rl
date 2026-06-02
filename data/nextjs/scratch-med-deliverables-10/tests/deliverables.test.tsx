import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, item: string, due = '2024-12-31') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), item)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function getRow(item: string): HTMLElement {
  const el = screen.getByText(item).closest('li')
  if (!el) throw new Error(`no row for ${item}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
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

  it('adds a deliverable with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Design mockups', '2024-11-01')
    const row = getRow('Design mockups')
    expect(within(row).getByText('pending')).toBeInTheDocument()
    expect(within(row).getByText('2024-11-01')).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('marks a pending item as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write report')
    await u.click(within(getRow('Write report')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Write report')).getByText('delivered')).toBeInTheDocument()
  })

  it('marks a delivered item back to pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch site')
    await u.click(within(getRow('Launch site')).getByRole('button', { name: /mark delivered/i }))
    await u.click(within(getRow('Launch site')).getByRole('button', { name: /mark pending/i }))
    expect(within(getRow('Launch site')).getByText('pending')).toBeInTheDocument()
  })

  it('Show: All filter button starts active (aria-pressed true)', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: All' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Show: Pending' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Show: Pending filter hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(getRow('Alpha')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('Show: Pending filter updates aria-pressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    expect(screen.getByRole('button', { name: 'Show: Pending' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Show: All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switching back to Show: All restores delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gamma')
    await u.click(within(getRow('Gamma')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    await u.click(screen.getByRole('button', { name: 'Show: All' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('Summary shows zeros when no deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added deliverables (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item A')
    await addItem(u, 'Item B')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary Progress updates when items are marked delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(getRow('X')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('Summary counts delivered items even when filter is pending-only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P')
    await addItem(u, 'Q')
    await u.click(within(getRow('P')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Show: Pending' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Deliverables')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('deliverable list persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })

  it('due date is displayed in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Invoice', '2025-03-15')
    expect(within(getRow('Invoice')).getByText('2025-03-15')).toBeInTheDocument()
  })
})
