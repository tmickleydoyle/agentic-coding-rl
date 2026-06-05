// HELD-OUT generalization tests — different inputs, edge cases, and cross-view paths.
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

describe('Release Checklist (held-out)', () => {
  it('completing all tasks shows 100% in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByRole('button', { name: /mark run smoke tests done/i }))
    await u.click(screen.getByRole('button', { name: /mark update changelog done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('By Owner omits owners whose tasks are all done', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Complete both Alice tasks
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByRole('button', { name: /mark update changelog done/i }))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).queryByText(/alice/i)).not.toBeInTheDocument()
    expect(within(byOwner).getByText('Bob: 1 remaining')).toBeInTheDocument()
  })

  it('adding a task with owner shows up in By Owner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Bump version', 'Eve')
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).getByText('Eve: 1 remaining')).toBeInTheDocument()
  })

  it('deleting a task updates Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete update changelog/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('completing two of three tasks gives 67% completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByRole('button', { name: /mark run smoke tests done/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Hide completed setting persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /mark write release notes done/i }))
    await u.click(screen.getByLabelText('Hide completed'))
    await nav(u, 'Summary')
    await nav(u, 'Checklist')
    expect(screen.queryByText('Write release notes')).not.toBeInTheDocument()
    expect(screen.getByText('Run smoke tests')).toBeInTheDocument()
  })

  it('Clear all then add a new task shows Tasks (1)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Checklist')
    await addTask(u, 'Fresh start', 'Zoe')
    expect(screen.getByRole('heading', { name: /tasks \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
  })

  it('Summary By Owner is empty when all tasks are done after clear+add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Checklist')
    await addTask(u, 'Only task', 'Sam')
    await u.click(screen.getByRole('button', { name: /mark only task done/i }))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).queryByText(/sam/i)).not.toBeInTheDocument()
  })

  it('theme toggle button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('tasks with no owner do not appear in By Owner if they are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Checklist')
    await addTask(u, 'Anonymous task')
    await u.click(screen.getByRole('button', { name: /mark anonymous task done/i }))
    await nav(u, 'Summary')
    const byOwner = screen.getByRole('region', { name: 'By Owner' })
    expect(within(byOwner).queryByText(/unassigned/i)).not.toBeInTheDocument()
  })
})
