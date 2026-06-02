import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority: string = 'med') {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), name)
  await u.selectOptions(screen.getByLabelText('Priority'), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows Showing: 0 tasks initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
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

  it('navigates back to Tasks from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write pitch deck', 'high')
    expect(screen.getByText('Write pitch deck')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Delete me')
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('toggles a task done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Close deal')
    const checkbox = screen.getByLabelText('Done: Close deal')
    expect(checkbox).not.toBeChecked()
    await u.click(checkbox)
    expect(screen.getByLabelText('Done: Close deal')).toBeChecked()
  })

  it('filter by priority hides non-matching tasks and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'high')
    await addTask(u, 'Low task', 'low')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('filter all restores all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'high')
    await addTask(u, 'Task B', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'all')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })

  it('filter med shows only med tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Med task', 'med')
    await addTask(u, 'High task', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'med')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('Med task')).toBeInTheDocument()
    expect(screen.queryByText('High task')).not.toBeInTheDocument()
  })

  it('stats total is 0 initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('stats reflect added tasks (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task 1', 'high')
    await addTask(u, 'Task 2', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('stats update when a task is marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finish MVP', 'high')
    await u.click(screen.getByLabelText('Done: Finish MVP'))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
  })

  it('stats show 50% completion for 1 of 2 done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'A', 'med')
    await addTask(u, 'B', 'med')
    await u.click(screen.getByLabelText('Done: A'))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('stats count priority breakdown correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'high')
    await addTask(u, 'H2', 'high')
    await addTask(u, 'M1', 'med')
    await addTask(u, 'L1', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
    expect(screen.queryByText('Gone')).not.toBeInTheDocument()
  })

  it('clear all tasks resets stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp', 'high')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating to other views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('tasks state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'low')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })
})
