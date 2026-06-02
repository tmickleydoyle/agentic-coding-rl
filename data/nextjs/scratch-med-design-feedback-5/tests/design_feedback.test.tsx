import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string | RegExp) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('shows Feedback (0) in nav initially', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
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
    await nav(u, /feedback/i)
    expect(screen.getByRole('heading', { name: 'Feedback' })).toBeInTheDocument()
  })

  it('adds a feedback item and shows note, screen, and status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button too small', 'Login')
    expect(screen.getByText('Button too small')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('ignores adding feedback when Note is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Dashboard')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('ignores adding feedback when Screen is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Looks off')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.queryByText('Looks off')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('increments open count in nav when feedback is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Typo here', 'Checkout')
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
    await addFeedback(u, 'Wrong color', 'Home')
    expect(screen.getByRole('button', { name: 'Feedback (2)' })).toBeInTheDocument()
  })

  it('marks a feedback item as addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix padding', 'Profile')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByText('addressed')).toBeInTheDocument()
    expect(screen.queryByText('open')).not.toBeInTheDocument()
  })

  it('decrements open count after marking addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Spacing issue', 'Settings')
    await addFeedback(u, 'Icon missing', 'Nav')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('reopens an addressed item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Needs contrast', 'Footer')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /reopen/i }))
    expect(screen.getByText('open')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('Open only filter hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Top nav broken', 'Nav')
    await addFeedback(u, 'Footer overlap', 'Footer')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByRole('button', { name: 'Open only' }))
    expect(screen.getByText('Footer overlap')).toBeInTheDocument()
    expect(screen.queryByText('Top nav broken')).not.toBeInTheDocument()
  })

  it('All filter shows both open and addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Align left', 'Modal')
    await addFeedback(u, 'Font size', 'Card')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByRole('button', { name: 'Open only' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Align left')).toBeInTheDocument()
    expect(screen.getByText('Font size')).toBeInTheDocument()
  })

  it('Summary shows zeroes with no feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added feedback (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Hero image broken', 'Home')
    await addFeedback(u, 'CTA too small', 'Landing')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 0%')).toBeInTheDocument()
  })

  it('Summary addressed rate updates after marking addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'A', 'PageA')
    await addFeedback(u, 'B', 'PageB')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 50%')).toBeInTheDocument()
  })

  it('Summary addressed rate is 100% when all addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Solo note', 'Onboarding')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 100%')).toBeInTheDocument()
  })

  it('theme defaults to light via data-theme attribute', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme changes data-theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating to other views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, /feedback/i)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Sidebar')
    await nav(u, 'Summary')
    await nav(u, /feedback/i)
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
  })

  it('clears input fields after adding feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Check alignment', 'Table')
    expect(screen.getByLabelText('Note')).toHaveValue('')
    expect(screen.getByLabelText('Screen')).toHaveValue('')
  })
})
