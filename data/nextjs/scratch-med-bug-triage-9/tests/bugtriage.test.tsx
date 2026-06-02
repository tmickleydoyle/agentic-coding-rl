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

describe('Bug Triage app', () => {
  it('starts on the Bugs view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('shows Showing: 0 bugs on an empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 bugs')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Bugs view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
  })

  it('adds a bug and it appears with open status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Login crash', 'critical')
    expect(screen.getByText('Login crash')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
    const li = screen.getByText('Login crash').closest('li') as HTMLElement
    expect(within(li).getByText('open')).toBeInTheDocument()
    expect(within(li).getByText('critical')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByText('Showing: 0 bugs')).toBeInTheDocument()
  })

  it('closes a bug and shows closed status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Null pointer', 'high')
    await u.click(screen.getByRole('button', { name: /close null pointer/i }))
    const li = screen.getByText('Null pointer').closest('li') as HTMLElement
    expect(within(li).getByText('closed')).toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /reopen null pointer/i })).toBeInTheDocument()
  })

  it('reopens a closed bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Memory leak', 'medium')
    await u.click(screen.getByRole('button', { name: /close memory leak/i }))
    await u.click(screen.getByRole('button', { name: /reopen memory leak/i }))
    const li = screen.getByText('Memory leak').closest('li') as HTMLElement
    expect(within(li).getByText('open')).toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /close memory leak/i })).toBeInTheDocument()
  })

  it('filters by open status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug A', 'low')
    await addBug(u, 'Bug B', 'high')
    await u.click(screen.getByRole('button', { name: /close bug a/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
    expect(screen.queryByText('Bug A')).not.toBeInTheDocument()
    expect(screen.getByText('Bug B')).toBeInTheDocument()
  })

  it('filters by closed status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug X', 'low')
    await addBug(u, 'Bug Y', 'medium')
    await u.click(screen.getByRole('button', { name: /close bug x/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
    expect(screen.getByText('Bug X')).toBeInTheDocument()
    expect(screen.queryByText('Bug Y')).not.toBeInTheDocument()
  })

  it('filter all shows every bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alpha', 'low')
    await addBug(u, 'Beta', 'critical')
    await u.click(screen.getByRole('button', { name: /close alpha/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 2 bugs')).toBeInTheDocument()
  })

  it('Stats view shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'P1', 'critical')
    await addBug(u, 'P2', 'high')
    await addBug(u, 'P3', 'low')
    await u.click(screen.getByRole('button', { name: /close p3/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('Stats view breaks down open by severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'C1', 'critical')
    await addBug(u, 'C2', 'critical')
    await addBug(u, 'H1', 'high')
    await addBug(u, 'M1', 'medium')
    await addBug(u, 'L1', 'low')
    await u.click(screen.getByRole('button', { name: /close c2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Critical open: 1')).toBeInTheDocument()
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
    expect(screen.getByText('Low open: 1')).toBeInTheDocument()
  })

  it('Stats shows zeros on empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('Critical open: 0')).toBeInTheDocument()
  })

  it('theme starts as light and data-theme is set', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
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
    await nav(u, 'Bugs')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('bug list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persistent bug', 'medium')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByText('Persistent bug')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 bugs')).toBeInTheDocument()
  })

  it('closing a bug updates Stats closed count (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Stale session', 'high')
    await u.click(screen.getByRole('button', { name: /close stale session/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('High open: 0')).toBeInTheDocument()
  })
})
