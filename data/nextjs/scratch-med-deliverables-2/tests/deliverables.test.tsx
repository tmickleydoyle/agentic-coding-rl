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
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /deliverables/i })).toBeInTheDocument()
    expect(screen.getByText('Design mockups')).toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.getByText('User testing')).toBeInTheDocument()
  })

  it('seeded heading count shows 3 items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables (3)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /deliverables/i })).toBeInTheDocument()
  })

  it('adds a new item and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Launch campaign', '2024-12-01')
    expect(screen.getByText('Launch campaign')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (4)' })).toBeInTheDocument()
  })

  it('ignores blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/due date/i))
    await u.type(screen.getByLabelText(/due date/i), '2024-12-01')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (3)' })).toBeInTheDocument()
  })

  it('ignores blank due date', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/item name/i))
    await u.type(screen.getByLabelText(/item name/i), 'Some item')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('heading', { name: 'Deliverables (3)' })).toBeInTheDocument()
  })

  it('new item has pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'New deliverable', '2024-12-15')
    expect(within(row('New deliverable')).getByText('pending')).toBeInTheDocument()
  })

  it('Mark delivered button is disabled for already-delivered items', () => {
    render(<App />)
    expect(
      within(row('Design mockups')).getByRole('button', { name: /mark delivered design mockups/i }),
    ).toBeDisabled()
  })

  it('Mark delivered button is enabled for pending items', () => {
    render(<App />)
    expect(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }),
    ).not.toBeDisabled()
  })

  it('marks a pending item as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }),
    )
    expect(within(row('API integration')).getByText('delivered')).toBeInTheDocument()
    expect(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }),
    ).toBeDisabled()
  })

  it('removes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('User testing')).getByRole('button', { name: /remove user testing/i }))
    expect(screen.queryByText('User testing')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (2)' })).toBeInTheDocument()
  })

  it('filter button starts as Show: all and toggles to Show: pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Show: all' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    expect(screen.getByRole('button', { name: 'Show: pending' })).toBeInTheDocument()
  })

  it('Show: pending filter hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    expect(screen.queryByText('Design mockups')).not.toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.getByText('User testing')).toBeInTheDocument()
  })

  it('heading count updates when filter is active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    expect(screen.getByRole('heading', { name: 'Deliverables (2)' })).toBeInTheDocument()
  })

  it('toggling filter back restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show: all' }))
    await u.click(screen.getByRole('button', { name: 'Show: pending' }))
    expect(screen.getByText('Design mockups')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Deliverables (3)' })).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary updates after marking an item delivered (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }),
    )
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Summary shows 0% when no deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Design mockups')).getByRole('button', { name: /remove design mockups/i }))
    await u.click(within(row('API integration')).getByRole('button', { name: /remove api integration/i }))
    await u.click(within(row('User testing')).getByRole('button', { name: /remove user testing/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view changes', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Deliverables')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('deliverables state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persistent item', '2024-12-31')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persistent item')).toBeInTheDocument()
  })
})
