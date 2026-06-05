import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, due = '2024-12-01') {
  await u.clear(screen.getByLabelText('Item'))
  await u.type(screen.getByLabelText('Item'), name)
  await u.clear(screen.getByLabelText('Due date'))
  await u.type(screen.getByLabelText('Due date'), due)
  await u.click(screen.getByRole('button', { name: /add deliverable/i }))
}

function itemRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Deliverables' })).toBeInTheDocument()
  })

  it('shows the three nav buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Deliverables' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates to Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
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

  it('shows Delivered: 0 of 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Delivered: 0 of 0')).toBeInTheDocument()
  })

  it('adds a deliverable and shows it as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Logo design', '2024-07-15')
    expect(screen.getByText('Logo design')).toBeInTheDocument()
    expect(within(itemRow('Logo design')).getByText('pending')).toBeInTheDocument()
    expect(within(itemRow('Logo design')).getByText('2024-07-15')).toBeInTheDocument()
  })

  it('ignores a blank item name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add deliverable/i }))
    expect(screen.getByText('Delivered: 0 of 0')).toBeInTheDocument()
  })

  it('updates Delivered count line after adding items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Wireframes')
    await addItem(u, 'Prototype')
    expect(screen.getByText('Delivered: 0 of 2')).toBeInTheDocument()
  })

  it('marks a deliverable as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Brand guide')
    await u.click(within(itemRow('Brand guide')).getByRole('button', { name: /mark delivered brand guide/i }))
    expect(within(itemRow('Brand guide')).getByText('delivered')).toBeInTheDocument()
  })

  it('disables Mark delivered button once delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Copy draft')
    await u.click(within(itemRow('Copy draft')).getByRole('button', { name: /mark delivered copy draft/i }))
    expect(within(itemRow('Copy draft')).getByRole('button', { name: /mark delivered copy draft/i })).toBeDisabled()
  })

  it('updates Delivered count after marking delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Mockups')
    await addItem(u, 'Icons')
    await u.click(within(itemRow('Mockups')).getByRole('button', { name: /mark delivered mockups/i }))
    expect(screen.getByText('Delivered: 1 of 2')).toBeInTheDocument()
  })

  it('deletes a deliverable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Old draft')
    await u.click(within(itemRow('Old draft')).getByRole('button', { name: /delete old draft/i }))
    expect(screen.queryByText('Old draft')).not.toBeInTheDocument()
    expect(screen.getByText('Delivered: 0 of 0')).toBeInTheDocument()
  })

  it('Show pending filter hides delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Alpha')
    await addItem(u, 'Beta')
    await u.click(within(itemRow('Alpha')).getByRole('button', { name: /mark delivered alpha/i }))
    await u.click(screen.getByRole('button', { name: 'Show pending' }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('Delivered count is unaffected by filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X')
    await addItem(u, 'Y')
    await u.click(within(itemRow('X')).getByRole('button', { name: /mark delivered x/i }))
    await u.click(screen.getByRole('button', { name: 'Show pending' }))
    expect(screen.getByText('Delivered: 1 of 2')).toBeInTheDocument()
  })

  it('Show all restores hidden delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Gamma')
    await u.click(within(itemRow('Gamma')).getByRole('button', { name: /mark delivered gamma/i }))
    await u.click(screen.getByRole('button', { name: 'Show pending' }))
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Show all' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('Summary shows correct stats (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P1')
    await addItem(u, 'P2')
    await addItem(u, 'P3')
    await u.click(within(itemRow('P1')).getByRole('button', { name: /mark delivered p1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Final')
    await u.click(within(itemRow('Final')).getByRole('button', { name: /mark delivered final/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('persists state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Persisted item')
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByText('Persisted item')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Deliverables')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
