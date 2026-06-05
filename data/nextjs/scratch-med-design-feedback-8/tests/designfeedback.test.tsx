import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, scrn: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), scrn)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('shows Open: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
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

  it('navigates back to Feedback view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('adds a feedback item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button misaligned', 'Login')
    expect(screen.getByText('Button misaligned')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('new item appears as open and shows Mark addressed button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Wrong color', 'Dashboard')
    expect(within(itemRow('Wrong color')).getByRole('button', { name: /mark addressed/i })).toBeInTheDocument()
  })

  it('open count increments when item is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Font too small', 'Profile')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    await addFeedback(u, 'Logo broken', 'Home')
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })

  it('ignores blank note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('ignores blank screen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Some issue')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('toggles item to addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Spacing off', 'Checkout')
    await u.click(within(itemRow('Spacing off')).getByRole('button', { name: /mark addressed/i }))
    expect(within(itemRow('Spacing off')).getByRole('button', { name: /mark open/i })).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('toggles item back to open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Typo here', 'About')
    await u.click(within(itemRow('Typo here')).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(itemRow('Typo here')).getByRole('button', { name: /mark open/i }))
    expect(within(itemRow('Typo here')).getByRole('button', { name: /mark addressed/i })).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('deletes an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Old note', 'Settings')
    await u.click(within(itemRow('Old note')).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Old note')).not.toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('Show open filter hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Open issue', 'Home')
    await addFeedback(u, 'Fixed issue', 'Home')
    await u.click(within(itemRow('Fixed issue')).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.getByText('Open issue')).toBeInTheDocument()
    expect(screen.queryByText('Fixed issue')).not.toBeInTheDocument()
  })

  it('Show open filter still shows correct Open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue A', 'Page1')
    await addFeedback(u, 'Issue B', 'Page2')
    await u.click(within(itemRow('Issue A')).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })

  it('Show all restores addressed items in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item X', 'Nav')
    await u.click(within(itemRow('Item X')).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /show open/i }))
    expect(screen.queryByText('Item X')).not.toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('Item X')).toBeInTheDocument()
  })

  it('Summary shows Total, Open, Addressed, Completion (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'N1', 'S1')
    await addFeedback(u, 'N2', 'S2')
    await u.click(within(itemRow('N1')).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Summary shows 0% completion when no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary shows 100% when all items addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done one', 'X')
    await u.click(within(itemRow('Done one')).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
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
    await nav(u, 'Feedback')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('feedback state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persisted note', 'Cart')
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persisted note')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
  })
})
