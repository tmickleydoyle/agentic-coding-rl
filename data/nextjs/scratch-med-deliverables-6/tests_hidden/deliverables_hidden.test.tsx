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

describe('Deliverables Tracker (held-out)', () => {
  it('all three seeded items appear by default (All filter)', () => {
    render(<App />)
    expect(screen.getByText('Homepage design')).toBeInTheDocument()
    expect(screen.getByText('API integration')).toBeInTheDocument()
    expect(screen.getByText('User testing report')).toBeInTheDocument()
  })

  it('seeded delivered item shows correct badge', () => {
    render(<App />)
    expect(within(row('Homepage design')).getByText('delivered')).toBeInTheDocument()
  })

  it('seeded pending items show correct badge', () => {
    render(<App />)
    expect(within(row('API integration')).getByText('pending')).toBeInTheDocument()
    expect(within(row('User testing report')).getByText('pending')).toBeInTheDocument()
  })

  it('adding an item without a due date still works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item'), 'Roadmap slide')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Roadmap slide')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /deliverables \(4\)/i })).toBeInTheDocument()
  })

  it('toggling item to delivered then back to pending works', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('User testing report')).getByRole('button', { name: /mark delivered user testing report/i }))
    expect(within(row('User testing report')).getByText('delivered')).toBeInTheDocument()
    await u.click(within(row('User testing report')).getByRole('button', { name: /mark pending user testing report/i }))
    expect(within(row('User testing report')).getByText('pending')).toBeInTheDocument()
  })

  it('pending filter count updates after marking item delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByRole('heading', { name: /deliverables \(2\)/i })).toBeInTheDocument()
    await u.click(within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }))
    expect(screen.getByRole('heading', { name: /deliverables \(1\)/i })).toBeInTheDocument()
  })

  it('delivered filter count updates after marking item pending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delivered' }))
    expect(screen.getByRole('heading', { name: /deliverables \(1\)/i })).toBeInTheDocument()
    await u.click(within(row('Homepage design')).getByRole('button', { name: /mark pending homepage design/i }))
    expect(screen.getByRole('heading', { name: /deliverables \(0\)/i })).toBeInTheDocument()
  })

  it('Summary Pending count reflects marking all delivered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('API integration')).getByRole('button', { name: /mark delivered api integration/i }))
    await u.click(within(row('User testing report')).getByRole('button', { name: /mark delivered user testing report/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 3')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 100%')).toBeInTheDocument()
  })

  it('Summary Total increases after adding an item on Deliverables view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item'), 'Extra deliverable')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Pending: 3')).toBeInTheDocument()
  })

  it('Clear all followed by adding a new item shows count of 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await u.type(screen.getByLabelText('Item'), 'Fresh start')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('heading', { name: /deliverables \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Fresh start')).toBeInTheDocument()
  })

  it('Summary after clear all shows all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0')).toBeInTheDocument()
    expect(screen.getByText('Pending: 0')).toBeInTheDocument()
    expect(screen.getByText('Delivered: 0%')).toBeInTheDocument()
  })

  it('All filter button has aria-pressed true by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switching theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
