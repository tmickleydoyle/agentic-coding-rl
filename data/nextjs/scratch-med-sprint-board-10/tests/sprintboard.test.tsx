import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const sec = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points?: number) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  if (points !== undefined) {
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), String(points))
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows empty column headings on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /^todo \(0\)$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^doing \(0\)$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^done \(0\)$/i })).toBeInTheDocument()
  })

  it('navigates to Stats and Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('adds a task to the Todo column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix login bug', 3)
    expect(within(sec('Todo')).getByText('Fix login bug (Pts: 3)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^todo \(1\)$/i })).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /^todo \(0\)$/i })).toBeInTheDocument()
  })

  it('shows points in the task entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', 5)
    expect(within(sec('Todo')).getByText('Write tests (Pts: 5)')).toBeInTheDocument()
  })

  it('shows total points per section', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 4)
    await addTask(u, 'Task B', 6)
    expect(within(sec('Todo')).getByText('Points: 10')).toBeInTheDocument()
  })

  it('changes task status using the selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy app', 2)
    const statusSel = screen.getByLabelText(/status of deploy app/i)
    await u.selectOptions(statusSel, 'doing')
    expect(within(sec('Doing')).getByText('Deploy app (Pts: 2)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^doing \(1\)$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^todo \(0\)$/i })).toBeInTheDocument()
  })

  it('moves a task all the way to Done and updates point totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Release v2', 8)
    const sel = screen.getByLabelText(/status of release v2/i)
    await u.selectOptions(sel, 'done')
    expect(within(sec('Done')).getByText('Release v2 (Pts: 8)')).toBeInTheDocument()
    expect(within(sec('Done')).getByText('Points: 8')).toBeInTheDocument()
    expect(within(sec('Todo')).getByText('Points: 0')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task', 1)
    await u.click(screen.getByRole('button', { name: /delete temp task/i }))
    expect(screen.queryByText(/temp task/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^todo \(0\)$/i })).toBeInTheDocument()
  })

  it('stats view shows zero completion with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('stats view reflects added tasks (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 3)
    await addTask(u, 'Beta', 7)
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 10/i)).toBeInTheDocument()
    expect(screen.getByText(/todo: 2 tasks, 10 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('stats completion updates when tasks are moved to Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 2)
    await addTask(u, 'Y', 2)
    const selX = screen.getByLabelText(/status of x/i)
    await u.selectOptions(selX, 'done')
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1 tasks, 2 pts/i)).toBeInTheDocument()
  })

  it('stats shows doing breakdown separately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'WIP task', 5)
    const sel = screen.getByLabelText(/status of wip task/i)
    await u.selectOptions(sel, 'doing')
    await nav(u, 'Stats')
    expect(screen.getByText(/doing: 1 tasks, 5 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/todo: 0 tasks, 0 pts/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
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

  it('hides done tasks on board when Hide done tasks is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finished task', 3)
    const sel = screen.getByLabelText(/status of finished task/i)
    await u.selectOptions(sel, 'done')
    expect(within(sec('Done')).getByText('Finished task (Pts: 3)')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(within(sec('Done')).queryByText('Finished task (Pts: 3)')).not.toBeInTheDocument()
  })

  it('hidden done tasks still counted in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Hidden done', 4)
    const sel = screen.getByLabelText(/status of hidden done/i)
    await u.selectOptions(sel, 'done')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Stats')
    expect(screen.getByText(/done: 1 tasks, 4 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('section point totals update after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keep this', 5)
    await addTask(u, 'Remove this', 3)
    await u.click(screen.getByRole('button', { name: /delete remove this/i }))
    expect(within(sec('Todo')).getByText('Points: 5')).toBeInTheDocument()
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 2)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(within(sec('Todo')).getByText('Persistent task (Pts: 2)')).toBeInTheDocument()
  })
})
