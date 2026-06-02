import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screen_: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screen_)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker', () => {
  it('starts on the Feedback view with heading Feedback (0)', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('renders nav buttons for all three views', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Feedback' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
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

  it('adds a feedback item and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Button too small', 'Login')
    expect(screen.getByText('Button too small')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('heading count increases after adding feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Contrast issue', 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('ignores feedback when Note is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Home')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('ignores feedback when Screen is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Note'), 'Something wrong')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    expect(screen.getByRole('heading', { name: 'Feedback (0)' })).toBeInTheDocument()
  })

  it('new feedback item starts with status open', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alignment off', 'Profile')
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('Mark Addressed button appears for open items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Font size', 'Settings')
    expect(screen.getByRole('button', { name: /mark addressed/i })).toBeInTheDocument()
  })

  it('marking addressed changes status and hides the button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Wrong color', 'Header')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByText('addressed')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mark addressed/i })).not.toBeInTheDocument()
  })

  it('Show open only filter hides addressed items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Icon missing', 'Nav')
    await addFeedback(u, 'Padding wrong', 'Footer')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Icon missing')).not.toBeInTheDocument()
    expect(screen.getByText('Padding wrong')).toBeInTheDocument()
  })

  it('heading count reflects filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'A', 'Screen1')
    await addFeedback(u, 'B', 'Screen2')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByRole('heading', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('unchecking Show open only restores all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Blur effect', 'Modal')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.queryByText('Blur effect')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText('Show open only'))
    expect(screen.getByText('Blur effect')).toBeInTheDocument()
  })

  it('Summary shows zero stats with no items', async () => {
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
    await addFeedback(u, 'Spacing issue', 'Cart')
    await addFeedback(u, 'Color mismatch', 'Checkout')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 0%')).toBeInTheDocument()
  })

  it('Summary updates after marking addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Typo in label', 'Sign Up')
    await addFeedback(u, 'CTA hidden', 'Landing')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 50%')).toBeInTheDocument()
  })

  it('Summary addressed rate rounds correctly for one of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'X', 'S1')
    await addFeedback(u, 'Y', 'S2')
    await addFeedback(u, 'Z', 'S3')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 33%')).toBeInTheDocument()
  })

  it('theme starts as light via data-theme attribute', () => {
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

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Feedback')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('feedback state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Persistent note', 'Dashboard')
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    expect(screen.getByText('Persistent note')).toBeInTheDocument()
  })
})
