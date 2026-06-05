// HELD-OUT generalization tests — different inputs, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity = 'low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

describe('Bug Triage (held-out)', () => {
  it('adds multiple bugs and Showing count updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Issue one', 'low')
    await addBug(u, 'Issue two', 'medium')
    await addBug(u, 'Issue three', 'high')
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })

  it('filter open then close a bug updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Flicker bug', 'low')
    await addBug(u, 'Crash bug', 'critical')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    await u.click(screen.getByRole('button', { name: /close flicker bug/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('Stats Critical open counts only open critical bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Crit A', 'critical')
    await addBug(u, 'Crit B', 'critical')
    await addBug(u, 'Crit C', 'critical')
    await u.click(screen.getByRole('button', { name: /close crit b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Critical open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('reopening a bug updates Stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Race condition', 'high')
    await u.click(screen.getByRole('button', { name: /close race condition/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    await nav(u, 'Bugs')
    await u.click(screen.getByRole('button', { name: /reopen race condition/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
  })

  it('filter closed shows zero when none closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Open only', 'medium')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByText('Showing: 0 bugs')).toBeInTheDocument()
    expect(screen.queryByText('Open only')).not.toBeInTheDocument()
  })

  it('Stats Medium open counts correctly after close and reopen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Med one', 'medium')
    await addBug(u, 'Med two', 'medium')
    await u.click(screen.getByRole('button', { name: /close med one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
    await nav(u, 'Bugs')
    await u.click(screen.getByRole('button', { name: /reopen med one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 2')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('severity of a bug is displayed correctly in the list row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Toolbar glitch', 'high')
    const li = screen.getByText('Toolbar glitch').closest('li') as HTMLElement
    expect(within(li).getByText('high')).toBeInTheDocument()
  })

  it('all three views are accessible by nav buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('Low open stat is 0 when all low bugs are closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Minor typo', 'low')
    await u.click(screen.getByRole('button', { name: /close minor typo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Low open: 0')).toBeInTheDocument()
  })
})
