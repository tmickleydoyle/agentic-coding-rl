// HELD-OUT generalization tests — fresh scenarios for eval only.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points = 1) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), String(points))
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board (held-out)', () => {
  it('each task row shows the status text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Audit logs', 2)
    expect(screen.getByText('todo')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /start audit logs/i }))
    expect(screen.getByText('doing')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /finish audit logs/i }))
    expect(screen.getByText('done')).toBeInTheDocument()
  })

  it('Stats done points update after finishing a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Migrate DB', 8)
    await u.click(screen.getByRole('button', { name: /start migrate db/i }))
    await u.click(screen.getByRole('button', { name: /finish migrate db/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done points: 8')).toBeInTheDocument()
    expect(screen.getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('Clear done does not remove todo or doing tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keep me', 3)
    await addTask(u, 'Clear me', 2)
    await u.click(screen.getByRole('button', { name: /start clear me/i }))
    await u.click(screen.getByRole('button', { name: /finish clear me/i }))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Clear me')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 1 tasks, 3 pts')).toBeInTheDocument()
  })

  it('Stats total points after clear done decreases correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Stays', 5)
    await addTask(u, 'Goes', 3)
    await u.click(screen.getByRole('button', { name: /start goes/i }))
    await u.click(screen.getByRole('button', { name: /finish goes/i }))
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 1')).toBeInTheDocument()
    expect(screen.getByText('Total points: 5')).toBeInTheDocument()
    expect(screen.getByText('Done: 0 tasks')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('unhiding done tasks restores them on Board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Restore me', 4)
    await u.click(screen.getByRole('button', { name: /start restore me/i }))
    await u.click(screen.getByRole('button', { name: /finish restore me/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i)) // hide
    await u.click(screen.getByLabelText(/hide done tasks/i)) // show again
    await nav(u, 'Board')
    expect(screen.getByText('Restore me')).toBeInTheDocument()
  })

  it('theme shows current value in button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('Finish button disabled on todo task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'NotStarted', 1)
    expect(screen.getByRole('button', { name: /finish notstarted/i })).toBeDisabled()
  })

  it('adding two tasks updates To Do count and points correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First', 3)
    await addTask(u, 'Second', 7)
    expect(screen.getByText('To Do: 2 tasks, 10 pts')).toBeInTheDocument()
  })

  it('Stats view updates when tasks are modified and revisited', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Phase1', 6)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 1')).toBeInTheDocument()
    await nav(u, 'Board')
    await addTask(u, 'Phase2', 4)
    await u.click(screen.getByRole('button', { name: /start phase1/i }))
    await u.click(screen.getByRole('button', { name: /finish phase1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 10')).toBeInTheDocument()
    expect(screen.getByText('Done points: 6')).toBeInTheDocument()
    expect(screen.getByText('Progress: 60%')).toBeInTheDocument()
  })
})
