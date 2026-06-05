import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Deliverables Tracker', () => {
  it('starts on the Deliverables view with seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /deliverables \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Homepage design')).toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.getByText('User testing report')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /deliverables \(3\)/i })).toBeInTheDocument()
  })

  it('adds a new deliverable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item'), 'Mobile mockups')
    await u.type(screen.getByLabelText('Due date'), '2024-08-01')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Mobile mockups')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /deliverables \(4\)/i })).toBeInTheDocument()
  })

  it('ignores blank item name on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('heading', { name: /deliverables \(3\)/i })).toBeInTheDocument()
  })

  it('new deliverable starts as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item'), 'Brand guidelines')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(within(row('Brand guidelines')).getByText('pending')).toBeInTheDocument()
  })

  it('mark delivered button is disabled on already-delivered item', () => {
    render(<App />)
    expect(
      within(row('Homepage design')).getByRole('button', { name: /mark delivered homepage design/i })
    ).toBeDisabled()
  })

  it('mark pending button is disabled on already-pending item', () => {
    render(<App />)
    expect(
      within(row('API integration')).getByRole('button', { name: /mark pending api integration/i })
    ).toBeDisabled()
  })

  it('marks a pending item as delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }))
    expect(within(row('API integration')).getByText('delivered')).toBeInTheDocument()
    expect(
      within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i })
    ).toBeDisabled()
  })

  it('marks a delivered item as pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Homepage design')).getByRole('button', { name: /mark pending homepage design/i }))
    expect(within(row('Homepage design')).getByText('pending')).toBeInTheDocument()
  })

  it('filter Pending shows only pending items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('heading', { name: /deliverables \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Homepage design')).not.toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.getByText('User testing report')).toBeInTheDocument()
  })

  it('filter Delivered shows only delivered items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByRole('heading', { name: /deliverables \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Homepage design')).toBeInTheDocument()
    expect(screen.queryByText('API integration')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /deliverables \(3\)/i })).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('button', { name: 'Pending' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Summary shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 33%')).toBeInTheDocument()
  })

  it('Summary updates after marking an item delivered (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Delivered: 2')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 66%')).toBeInTheDocument()
  })

  it('Summary shows 0% when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('Clear all removes all deliverables', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.getByRole('heading', { name: /deliverables \(0\)/i })).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Deliverables')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    await nav(u, 'Summary')
    await nav(u, 'Deliverables')
    expect(screen.getByRole('button', { name: 'Pending' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: /deliverables \(2\)/i })).toBeInTheDocument()
  })
})
