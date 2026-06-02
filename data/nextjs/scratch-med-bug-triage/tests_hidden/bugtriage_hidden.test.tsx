// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: 'low' | 'medium' | 'high' = 'low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

describe('Bug Triage Tool (held-out)', () => {
  it('Showing line reflects all three seeded bugs with all filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
  })

  it('closed rate is 100% when all bugs are closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    // close both open seed bugs
    const li1 = screen.getByText('Login page crashes').closest('li') as HTMLElement
    await u.click(within(li1).getByRole('button', { name: 'Close' }))
    const li2 = screen.getByText('Tooltip flicker').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 3')).toBeInTheDocument()
  })

  it('adding multiple bugs increments total in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug A', 'high')
    await addBug(u, 'Bug B', 'medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 5')).toBeInTheDocument()
    expect(screen.getByText('Open high severity: 2')).toBeInTheDocument()
    expect(screen.getByText('Open medium severity: 1')).toBeInTheDocument()
  })

  it('filter closed then add a new bug — new bug is not shown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    await addBug(u, 'Fresh issue', 'low')
    expect(screen.queryByText('Fresh issue')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('filter open then close a bug — that bug disappears', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
    const li = screen.getByText('Tooltip flicker').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Tooltip flicker')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats open low severity drops when a low bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Tooltip flicker').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Close' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open low severity: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
  })

  it('severity badge is visible in the bug row', () => {
    render(<App />)
    const li = screen.getByText('Login page crashes').closest('li') as HTMLElement
    expect(within(li).getByText('high')).toBeInTheDocument()
  })

  it('switching back to all filter shows all bugs again after filtering', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 3 bugs')).toBeInTheDocument()
    expect(screen.getByText('Wrong favicon')).toBeInTheDocument()
  })

  it('stats shows 0% closed rate initially only if no bugs — seeded data gives 33%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // seeded: 1 of 3 closed = 33%
    expect(screen.getByText('Closed rate: 33%')).toBeInTheDocument()
  })

  it('bug list state persists when navigating to settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persistent bug', 'medium')
    await nav(u, 'Settings')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 bugs')).toBeInTheDocument()
  })
})
