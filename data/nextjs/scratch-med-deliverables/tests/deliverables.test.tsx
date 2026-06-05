import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2024-12-31') {
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  await u.clear(screen.getByLabelText(/due date/i))
  await u.type(screen.getByLabelText(/due date/i), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
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

  it('shows Showing: 0 items on an empty list', () => {
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

  it('navigates back to Deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('adds a deliverable and shows it with pending status', async () => {
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
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Showing: 0 items')).toBeInTheDocument()
  })

  it('updates Showing count after adding items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item A')
    await addItem(u, 'Item B')
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Write report')
    await u.click(within(getRow('Write report')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Write report')).getByText('delivered')).toBeInTheDocument()
  })

  it('hides Mark delivered button after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Send invoice')
    await u.click(within(getRow('Send invoice')).getByRole('button', { name: /mark delivered/i }))
    expect(within(getRow('Send invoice')).queryByRole('button', { name: /mark delivered/i })).not.toBeInTheDocument()
  })

  it('filters to Pending only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Task P')
    await addItem(u, 'Task D')
    await u.click(within(getRow('Task D')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Task P')).toBeInTheDocument()
    expect(screen.queryByText('Task D')).not.toBeInTheDocument()
  })

  it('filters to Delivered only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(getRow('Alpha')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('All filter shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    await u.click(within(getRow('One')).getByRole('button', { name: /mark delivered/i }))
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 items')).toBeInTheDocument()
  })

  it('Summary shows zeros with no deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added deliverables (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Spec A')
    await addItem(u, 'Spec B')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary updates after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(getRow('X')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('Summary Progress is 100% when all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done1')
    await u.click(within(getRow('Done1')).getByRole('button', { name: /mark delivered/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persist me', '2024-06-01')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 items')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
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

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
