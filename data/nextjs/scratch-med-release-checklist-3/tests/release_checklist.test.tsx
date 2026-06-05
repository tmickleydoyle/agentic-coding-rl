import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, owner = '') {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), name)
  await u.clear(screen.getByLabelText('Owner'))
  if (owner) await u.type(screen.getByLabelText('Owner'), owner)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Release Checklist app', () => {
  it('starts on the Checklist view with seeded tasks', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tasks \(3\)/i })).toBeInTheDocument()
  })

  it('shows correct Remaining count with seeded data', () => {
    render(<App />)
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
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

  it('navigates back to Checklist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: 'Checklist' })).toBeInTheDocument()
  })

  it('adds a new task and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy to staging', 'Carol')
    expect(screen.getByRole('heading', { name: /tasks \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Deploy to staging')).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /tasks \(3\)/i })).toBeInTheDocument()
  })

  it('marks a task done and updates Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('marks a task undone and updates Remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByRole('button', { name: /mark write release notes undone/i }))
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
  })

  it('deletes a task and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete run smoke tests/i }))
    expect(screen.getByRole('heading', { name: /tasks \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Run smoke tests')).not.toBeInTheDocument()
  })

  it('hides completed tasks when Hide completed is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByLabelText('Hide completed'))
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
  })

  it('still shows correct task total when hide completed is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByLabelText('Hide completed'))
    expect(screen.getByRole('heading', { name: /tasks \(3\)/i })).toBeInTheDocument()
  })

  it('un-checking Hide completed restores completed tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByLabelText('Hide completed'))
    await u.click(screen.getByLabelText('Hide completed'))
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
  })

  it('Summary shows correct totals with seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects marking a task done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Summary shows By Owner section with remaining counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Alice: 2 remaining')).toBeInTheDocument()
    expect(within(byOwner).getByText('Bob: 1 remaining')).toBeInTheDocument()
  })

  it('Summary By Owner updates when a task is completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Alice: 1 remaining')).toBeInTheDocument()
  })

  it('Summary By Owner groups tasks with no owner as Unassigned', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Notify stakeholders')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Unassigned: 1 remaining')).toBeInTheDocument()
  })

  it('Settings toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Checklist')
    expect(screen.getByRole('heading', { name: /tasks \(0\)/i })).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Summary shows 0% completion after clear all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Tag release', 'Dave')
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.getByText('Tag release')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tasks \(4\)/i })).toBeInTheDocument()
  })
})
