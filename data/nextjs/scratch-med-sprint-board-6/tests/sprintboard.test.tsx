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

describe('Sprint Board app', () => {
  it('starts on the Board view with heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
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

  it('navigates back to Board view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows empty summary lines on load', () => {
    render(<App />)
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0 tasks, 0 pts')).toBeInTheDocument()
    expect(screen.getByText('Done: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('adds a task and shows it in To Do summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', 3)
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1 tasks, 3 pts')).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('Start button moves task to Doing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix bug', 2)
    await u.click(screen.getByRole('button', { name: /start fix bug/i }))
    expect(screen.getByText('Doing: 1 tasks, 2 pts')).toBeInTheDocument()
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('Start button is disabled when task is not todo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy', 5)
    await u.click(screen.getByRole('button', { name: /start deploy/i }))
    expect(screen.getByRole('button', { name: /start deploy/i })).toBeDisabled()
  })

  it('Finish button moves task to Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Review PR', 4)
    await u.click(screen.getByRole('button', { name: /start review pr/i }))
    await u.click(screen.getByRole('button', { name: /finish review pr/i }))
    expect(screen.getByText('Done: 1 tasks, 4 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('Finish button is disabled when task is todo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Refactor', 2)
    expect(screen.getByRole('button', { name: /finish refactor/i })).toBeDisabled()
  })

  it('Clear done removes done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old task', 1)
    await u.click(screen.getByRole('button', { name: /start old task/i }))
    await u.click(screen.getByRole('button', { name: /finish old task/i }))
    expect(screen.getByText('Done: 1 tasks, 1 pts')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.queryByText('Old task')).not.toBeInTheDocument()
    expect(screen.getByText('Done: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('Stats shows correct totals after adding tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 3)
    await addTask(u, 'Task B', 5)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 8')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Stats shows zero progress when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('Stats reflects done tasks correctly (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 4)
    await addTask(u, 'Beta', 6)
    await u.click(screen.getByRole('button', { name: /start alpha/i }))
    await u.click(screen.getByRole('button', { name: /finish alpha/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 10')).toBeInTheDocument()
    expect(screen.getByText('Done: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('Done points: 4')).toBeInTheDocument()
    expect(screen.getByText('Progress: 40%')).toBeInTheDocument()
  })

  it('Stats progress rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 1)
    await addTask(u, 'Y', 1)
    await addTask(u, 'Z', 1)
    await u.click(screen.getByRole('button', { name: /start x/i }))
    await u.click(screen.getByRole('button', { name: /finish x/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('theme toggles and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Hide done tasks hides done tasks on Board but still counts them in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Completed task', 3)
    await u.click(screen.getByRole('button', { name: /start completed task/i }))
    await u.click(screen.getByRole('button', { name: /finish completed task/i }))
    expect(screen.getByText('Completed task')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
    expect(screen.getByText('Done: 1 tasks, 3 pts')).toBeInTheDocument()
  })

  it('board state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 2)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1 tasks, 2 pts')).toBeInTheDocument()
  })

  it('multiple tasks with different statuses show correct summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task1', 2)
    await addTask(u, 'Task2', 3)
    await addTask(u, 'Task3', 5)
    await u.click(screen.getByRole('button', { name: /start task1/i }))
    await u.click(screen.getByRole('button', { name: /finish task1/i }))
    await u.click(screen.getByRole('button', { name: /start task2/i }))
    expect(screen.getByText('To Do: 1 tasks, 5 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1 tasks, 3 pts')).toBeInTheDocument()
    expect(screen.getByText('Done: 1 tasks, 2 pts')).toBeInTheDocument()
  })
})
