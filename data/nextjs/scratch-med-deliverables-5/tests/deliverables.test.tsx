import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, item: string, due = '') {
  await u.clear(screen.getByLabelText(/^item$/i))
  await u.type(screen.getByLabelText(/^item$/i), item)
  if (due) {
    await u.clear(screen.getByLabelText(/due date/i))
    await u.type(screen.getByLabelText(/due date/i), due)
  }
  await u.click(screen.getByRole('button', { name: /^add$/i }))
}

function row(item: string): HTMLElement {
  const el = screen.getByText(item).closest('li')
  if (!el) throw new Error(`no row for ${item}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows All deliverables (0) by default', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'All deliverables (0)' })).toBeInTheDocument()
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

  it('adds a deliverable and shows it with pending status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Logo design', 'June 1')
    expect(screen.getByText('Logo design')).toBeInTheDocument()
    expect(within(row('Logo design')).getByText('pending')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All deliverables (1)' })).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByRole('heading', { name: 'All deliverables (0)' })).toBeInTheDocument()
  })

  it('shows due date in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes', 'May 30')
    expect(within(row('Wireframes')).getByText('May 30')).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Brand guide')
    await u.click(within(row('Brand guide')).getByRole('button', { name: /mark delivered brand guide/i }))
    expect(within(row('Brand guide')).getByText('delivered')).toBeInTheDocument()
  })

  it('Mark delivered button is disabled once delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Prototype')
    await u.click(within(row('Prototype')).getByRole('button', { name: /mark delivered prototype/i }))
    expect(within(row('Prototype')).getByRole('button', { name: /mark delivered prototype/i })).toBeDisabled()
  })

  it('Show Pending filter hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Report')
    await addItem(u, 'Slides')
    await u.click(within(row('Report')).getByRole('button', { name: /mark delivered report/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.queryByText('Report')).not.toBeInTheDocument()
    expect(screen.getByText('Slides')).toBeInTheDocument()
  })

  it('Pending filter heading shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A')
    await addItem(u, 'B')
    await addItem(u, 'C')
    await u.click(within(row('A')).getByRole('button', { name: /mark delivered a/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    expect(screen.getByRole('heading', { name: 'Pending deliverables (2)' })).toBeInTheDocument()
  })

  it('Show All restores all items after pending filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Draft')
    await u.click(within(row('Draft')).getByRole('button', { name: /mark delivered draft/i }))
    await u.click(screen.getByRole('button', { name: /show pending/i }))
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All deliverables (1)' })).toBeInTheDocument()
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

  it('Summary reflects cross-view state after adding items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item X')
    await addItem(u, 'Item Y')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Summary updates progress after marking delivered (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P')
    await addItem(u, 'Q')
    await u.click(within(row('P')).getByRole('button', { name: /mark delivered p/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument()
  })

  it('Summary progress is 100% when all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Done1')
    await addItem(u, 'Done2')
    await u.click(within(row('Done1')).getByRole('button', { name: /mark delivered done1/i }))
    await u.click(within(row('Done2')).getByRole('button', { name: /mark delivered done2/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('toggles theme light to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
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

  it('deliverables state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item', 'Dec 31')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
    expect(screen.getByText('Dec 31')).toBeInTheDocument()
  })

  it('multiple deliverables all count in heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'One')
    await addItem(u, 'Two')
    await addItem(u, 'Three')
    expect(screen.getByRole('heading', { name: 'All deliverables (3)' })).toBeInTheDocument()
  })
})
