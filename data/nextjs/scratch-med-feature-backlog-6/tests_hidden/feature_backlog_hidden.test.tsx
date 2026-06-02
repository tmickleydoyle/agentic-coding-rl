// HELD-OUT generalization tests — fresh scenarios not in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, title: string, priority = 'P1', status = 'idea') {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Priority$/i), priority)
  await u.selectOptions(screen.getByLabelText(/^Status$/i), status)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog (held-out)', () => {
  it('adds multiple P0 features and filter count matches', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Security patch', 'P0', 'idea')
    await addFeature(u, 'Auth revamp', 'P0', 'building')
    await addFeature(u, 'Nice UI', 'P2', 'idea')
    await u.click(screen.getByRole('button', { name: 'P0' }))
    expect(screen.getByText('Showing: 2 features')).toBeInTheDocument()
    expect(screen.getByText('Security patch')).toBeInTheDocument()
    expect(screen.getByText('Auth revamp')).toBeInTheDocument()
    expect(screen.queryByText('Nice UI')).not.toBeInTheDocument()
  })

  it('P1 filter with zero matching shows Showing: 0 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Only P0', 'P0', 'idea')
    await u.click(screen.getByRole('button', { name: 'P1' }))
    expect(screen.getByText('Showing: 0 features')).toBeInTheDocument()
  })

  it('Stats reflects P0 count after adding P0 features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Blocker', 'P0', 'idea')
    await addFeature(u, 'Blocker 2', 'P0', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 2')).toBeInTheDocument()
    expect(screen.getByText('Total features: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('toggling status multiple times reflects last value in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Flip', 'P1', 'idea')
    await u.selectOptions(screen.getByLabelText(/status for flip/i), 'shipped')
    await u.selectOptions(screen.getByLabelText(/status for flip/i), 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('deleting a feature updates Stats total and shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep this', 'P1', 'shipped')
    await addFeature(u, 'Bye', 'P0', 'shipped')
    await u.click(screen.getByRole('button', { name: /delete bye/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total features: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('theme toggle switches back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('clear all then re-add shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Stale feature', 'P2', 'idea')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all features/i }))
    await nav(u, 'Backlog')
    await addFeature(u, 'Fresh feature', 'P1', 'building')
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    expect(screen.getByText('Fresh feature')).toBeInTheDocument()
    expect(screen.queryByText('Stale feature')).not.toBeInTheDocument()
  })

  it('filter persists when new features are added that do not match', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'High prio', 'P0', 'idea')
    await u.click(screen.getByRole('button', { name: 'P0' }))
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    await addFeature(u, 'Low prio', 'P2', 'idea')
    // still filtered to P0
    expect(screen.getByText('Showing: 1 features')).toBeInTheDocument()
    expect(screen.queryByText('Low prio')).not.toBeInTheDocument()
  })

  it('Stats view shows P2 count correctly after mixed adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Nice A', 'P2', 'idea')
    await addFeature(u, 'Nice B', 'P2', 'shipped')
    await addFeature(u, 'Urgent', 'P0', 'idea')
    await nav(u, 'Stats')
    expect(screen.getByText('P2: 2')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('P1: 0')).toBeInTheDocument()
  })
})
