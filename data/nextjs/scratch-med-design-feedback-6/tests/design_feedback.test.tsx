import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screenName)
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
    expect(screen.getByRole('heading', { name: /open feedback \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Feedback')
    expect(screen.getByRole('heading', { name: /open feedback/i })).toBeInTheDocument()
  })

  it('adds a feedback item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button too small', 'Login')
    expect(screen.getByText('Button too small')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('updates the open count heading when items are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Misaligned text', 'Dashboard')
    expect(screen.getByRole('heading', { name: /open feedback \(1\)/i })).toBeInTheDocument()
    await addFeedback(u, 'Wrong color', 'Profile')
    expect(screen.getByRole('heading', { name: /open feedback \(2\)/i })).toBeInTheDocument()
  })

  it('ignores submission when Note is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: /open feedback \(0\)/i })).toBeInTheDocument()
  })

  it('ignores submission when Screen is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Too bright')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: /open feedback \(0\)/i })).toBeInTheDocument()
  })

  it('clears inputs after adding feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix spacing', 'Cart')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Screen')).toHaveValue('')
  })

  it('shows Mark addressed button only on open items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Bold the title', 'Header')
    expect(within(itemRow('Bold the title')).getByRole('button', { name: /mark addressed Bold the title/i })).toBeInTheDocument()
  })

  it('marks an item as addressed and hides its button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix icon', 'Nav')
    await u.click(within(itemRow('Fix icon')).getByRole('button', { name: /mark addressed Fix icon/i }))
    expect(screen.getByText('addressed')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mark addressed Fix icon/i })).not.toBeInTheDocument()
  })

  it('decrements open count when an item is addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Blur effect', 'Modal')
    await addFeedback(u, 'Font size', 'Footer')
    expect(screen.getByRole('heading', { name: /open feedback \(2\)/i })).toBeInTheDocument()
    await u.click(within(itemRow('Blur effect')).getByRole('button', { name: /mark addressed Blur effect/i }))
    expect(screen.getByRole('heading', { name: /open feedback \(1\)/i })).toBeInTheDocument()
  })

  it('filters to open items only when Show open only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Padding issue', 'Sidebar')
    await addFeedback(u, 'Color contrast', 'Sidebar')
    await u.click(within(itemRow('Padding issue')).getByRole('button', { name: /mark addressed Padding issue/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Padding issue')).not.toBeInTheDocument()
    expect(screen.getByText('Color contrast')).toBeInTheDocument()
  })

  it('shows all items when Show open only is unchecked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Shadow depth', 'Card')
    await u.click(within(itemRow('Shadow depth')).getByRole('button', { name: /mark addressed Shadow depth/i }))
    await u.click(screen.getByLabelText('Show open only'))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByText('Shadow depth')).toBeInTheDocument()
  })

  it('open count heading stays accurate while filter is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Overflow bug', 'Table')
    await addFeedback(u, 'Spacing bug', 'Table')
    await u.click(within(itemRow('Overflow bug')).getByRole('button', { name: /mark addressed Overflow bug/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByRole('heading', { name: /open feedback \(1\)/i })).toBeInTheDocument()
  })

  it('Stats view shows zeros with no items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0%')).toBeInTheDocument()
  })

  it('Stats view reflects added and addressed items (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Broken link', 'Onboarding')
    await addFeedback(u, 'Missing icon', 'Onboarding')
    await u.click(within(itemRow('Broken link')).getByRole('button', { name: /mark addressed Broken link/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 50%')).toBeInTheDocument()
  })

  it('Stats Addressed percentage rounds correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'A')
    await addFeedback(u, 'Two', 'A')
    await addFeedback(u, 'Three', 'A')
    await u.click(within(itemRow('One')).getByRole('button', { name: /mark addressed One/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Addressed: 33%')).toBeInTheDocument()
  })

  it('theme starts as light and toggles to dark', async () => {
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
    await nav(u, 'Feedback')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Default to open only in Settings toggles the filter on Feedback view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Hover state', 'Button')
    await u.click(within(itemRow('Hover state')).getByRole('button', { name: /mark addressed Hover state/i }))
    await addFeedback(u, 'Active state', 'Button')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Default to open only'))
    await nav(u, 'Feedback')
    expect(screen.queryByText('Hover state')).not.toBeInTheDocument()
    expect(screen.getByText('Active state')).toBeInTheDocument()
    expect(screen.getByLabelText('Show open only')).toBeChecked()
  })

  it('feedback list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persisted note', 'Checkout')
    await nav(u, 'Stats')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persisted note')).toBeInTheDocument()
  })
})
