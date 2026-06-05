import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points?: number) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  if (points !== undefined) {
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), String(points))
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows zero counters on empty board', () => {
    render(<App />)
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0 tasks, 0 pts')).toBeInTheDocument()
    expect(screen.getByText('Done: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('navigates to Stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('navigates to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a task and updates To Do counter', async () => {
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

  it('shows points in the task row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Design UI', 5)
    expect(within(taskRow('Design UI')).getByText(/5 pts/)).toBeInTheDocument()
  })

  it('changes task status via the selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Refactor', 2)
    await u.selectOptions(within(taskRow('Refactor')).getByRole('combobox'), 'doing')
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1 tasks, 2 pts')).toBeInTheDocument()
  })

  it('moves a task to done and updates counters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy', 4)
    await u.selectOptions(within(taskRow('Deploy')).getByRole('combobox'), 'done')
    expect(screen.getByText('Done: 1 tasks, 4 pts')).toBeInTheDocument()
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temporary', 1)
    await u.click(screen.getByRole('button', { name: /delete temporary/i }))
    expect(screen.queryByText('Temporary')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('filters tasks by status without affecting counters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 2)
    await addTask(u, 'Beta', 3)
    await u.selectOptions(within(taskRow('Beta')).getByRole('combobox'), 'doing')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'todo')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    // counters still show all
    expect(screen.getByText('To Do: 1 tasks, 2 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1 tasks, 3 pts')).toBeInTheDocument()
  })

  it('filter set to done shows only done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gamma', 1)
    await addTask(u, 'Delta', 2)
    await u.selectOptions(within(taskRow('Delta')).getByRole('combobox'), 'done')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'done')
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
  })

  it('stats view shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 3)
    await addTask(u, 'Task B', 5)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 8')).toBeInTheDocument()
    expect(screen.getByText('Done: 0 tasks')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    expect(screen.getByText('Points done: 0')).toBeInTheDocument()
  })

  it('stats completion updates after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 4)
    await addTask(u, 'Y', 4)
    await u.selectOptions(within(taskRow('X')).getByRole('combobox'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
    expect(screen.getByText('Points done: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 1 tasks')).toBeInTheDocument()
  })

  it('stats shows 0% completion when board is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
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

  it('theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'ToDelete', 2)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Board')
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 0 tasks, 0 pts')).toBeInTheDocument()
  })

  it('clear all tasks reflects in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'WillGo', 5)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
  })

  it('board state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persist me', 7)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1 tasks, 7 pts')).toBeInTheDocument()
  })

  it('multiple tasks accumulate points correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 2)
    await addTask(u, 'P2', 3)
    await addTask(u, 'P3', 5)
    expect(screen.getByText('To Do: 3 tasks, 10 pts')).toBeInTheDocument()
  })
})
