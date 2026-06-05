import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points?: string) {
  await u.clear(screen.getByLabelText('Task name'))
  await u.type(screen.getByLabelText('Task name'), title)
  if (points !== undefined) {
    await u.clear(screen.getByLabelText('Points'))
    await u.type(screen.getByLabelText('Points'), points)
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows empty column headings on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /to do \(0\) — 0 pts/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(0\) — 0 pts/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0\) — 0 pts/i })).toBeInTheDocument()
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

  it('adds a task to To Do with default 1 point', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix login bug')
    expect(within(col('To Do')).getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(1\) — 1 pts/i })).toBeInTheDocument()
  })

  it('adds a task with custom points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Refactor API', '5')
    expect(screen.getByRole('heading', { name: /to do \(1\) — 5 pts/i })).toBeInTheDocument()
  })

  it('ignores blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /to do \(0\) — 0 pts/i })).toBeInTheDocument()
  })

  it('moves a task right todo -> doing -> done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy app', '3')
    expect(within(taskRow('Deploy app')).getByRole('button', { name: /move deploy app left/i })).toBeDisabled()
    await u.click(within(taskRow('Deploy app')).getByRole('button', { name: /move deploy app right/i }))
    expect(within(col('Doing')).getByText('Deploy app')).toBeInTheDocument()
    await u.click(within(taskRow('Deploy app')).getByRole('button', { name: /move deploy app right/i }))
    expect(within(col('Done')).getByText('Deploy app')).toBeInTheDocument()
    expect(within(taskRow('Deploy app')).getByRole('button', { name: /move deploy app right/i })).toBeDisabled()
  })

  it('moves a task left from doing back to todo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', '2')
    await u.click(within(taskRow('Write tests')).getByRole('button', { name: /move write tests right/i }))
    expect(within(col('Doing')).getByText('Write tests')).toBeInTheDocument()
    await u.click(within(taskRow('Write tests')).getByRole('button', { name: /move write tests left/i }))
    expect(within(col('To Do')).getByText('Write tests')).toBeInTheDocument()
  })

  it('updates column counts and points when task moves', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '4')
    await u.click(within(taskRow('Task A')).getByRole('button', { name: /move task a right/i }))
    expect(screen.getByRole('heading', { name: /to do \(0\) — 0 pts/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(1\) — 4 pts/i })).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Remove me', '2')
    expect(within(col('To Do')).getByText('Remove me')).toBeInTheDocument()
    await u.click(within(taskRow('Remove me')).getByRole('button', { name: /delete remove me/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0\) — 0 pts/i })).toBeInTheDocument()
  })

  it('stats shows zero completion with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('stats reflects board state (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '3')
    await addTask(u, 'Beta', '5')
    await u.click(within(taskRow('Alpha')).getByRole('button', { name: /move alpha right/i }))
    await u.click(within(taskRow('Alpha')).getByRole('button', { name: /move alpha right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 8/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1 tasks, 3 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/to do: 1 tasks, 5 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
  })

  it('stats completion rounds correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', '1')
    await addTask(u, 'T2', '1')
    await addTask(u, 'T3', '1')
    await u.click(within(taskRow('T1')).getByRole('button', { name: /move t1 right/i }))
    await u.click(within(taskRow('T1')).getByRole('button', { name: /move t1 right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('board state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persist me', '7')
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(within(col('To Do')).getByText('Persist me')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(1\) — 7 pts/i })).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('hides done tasks on board when Hide done tasks is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Completed task', '2')
    await u.click(within(taskRow('Completed task')).getByRole('button', { name: /move completed task right/i }))
    await u.click(within(taskRow('Completed task')).getByRole('button', { name: /move completed task right/i }))
    expect(within(col('Done')).getByText('Completed task')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(within(col('Done')).queryByText('Completed task')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(1\) — 2 pts/i })).toBeInTheDocument()
  })

  it('done tasks still counted in Stats when hidden on board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Hidden task', '4')
    await u.click(within(taskRow('Hidden task')).getByRole('button', { name: /move hidden task right/i }))
    await u.click(within(taskRow('Hidden task')).getByRole('button', { name: /move hidden task right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Stats')
    expect(screen.getByText(/done: 1 tasks, 4 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('multiple tasks across all columns shown in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', '2')
    await addTask(u, 'P2', '3')
    await addTask(u, 'P3', '5')
    await u.click(within(taskRow('P1')).getByRole('button', { name: /move p1 right/i }))
    await u.click(within(taskRow('P2')).getByRole('button', { name: /move p2 right/i }))
    await u.click(within(taskRow('P2')).getByRole('button', { name: /move p2 right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 10/i)).toBeInTheDocument()
    expect(screen.getByText(/to do: 1 tasks, 5 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/doing: 1 tasks, 2 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1 tasks, 3 pts/i)).toBeInTheDocument()
  })
})
