import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const group = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points = '1') {
  await u.clear(screen.getByLabelText(/task title/i))
  await u.type(screen.getByLabelText(/task title/i), title)
  await u.clear(screen.getByLabelText(/points/i))
  await u.type(screen.getByLabelText(/points/i), points)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board app', () => {
  it('starts on the Board view with empty groups', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /todo \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0\)/i })).toBeInTheDocument()
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

  it('navigates back to Board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('adds a task to Todo group', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Design mockup', '3')
    expect(within(group('Todo')).getByText('Design mockup')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /todo \(1\) — 3 pts/i })).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /todo \(0\)/i })).toBeInTheDocument()
  })

  it('cycles task status Todo -> Doing via Start button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', '2')
    await u.click(screen.getByRole('button', { name: /start write tests/i }))
    expect(within(group('Doing')).getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(1\) — 2 pts/i })).toBeInTheDocument()
  })

  it('cycles task status Doing -> Done via Finish button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Review PR', '5')
    await u.click(screen.getByRole('button', { name: /start review pr/i }))
    await u.click(screen.getByRole('button', { name: /finish review pr/i }))
    expect(within(group('Done')).getByText('Review PR')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(1\) — 5 pts/i })).toBeInTheDocument()
  })

  it('cycles task status Done -> Todo via Reset button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy app', '8')
    await u.click(screen.getByRole('button', { name: /start deploy app/i }))
    await u.click(screen.getByRole('button', { name: /finish deploy app/i }))
    await u.click(screen.getByRole('button', { name: /reset deploy app/i }))
    expect(within(group('Todo')).getByText('Deploy app')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task', '1')
    await u.click(screen.getByRole('button', { name: /delete temp task/i }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /todo \(0\)/i })).toBeInTheDocument()
  })

  it('group headings reflect multiple tasks and summed points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '3')
    await addTask(u, 'Task B', '5')
    expect(screen.getByRole('heading', { name: /todo \(2\) — 8 pts/i })).toBeInTheDocument()
  })

  it('stats view shows correct totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '3')
    await addTask(u, 'Beta', '5')
    await u.click(screen.getByRole('button', { name: /start alpha/i }))
    await u.click(screen.getByRole('button', { name: /finish alpha/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 8/i)).toBeInTheDocument()
    expect(screen.getByText(/todo: 1 tasks, 5 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1 tasks, 3 pts/i)).toBeInTheDocument()
  })

  it('stats completed percentage is rounded whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', '4')
    await addTask(u, 'Y', '8')
    await u.click(screen.getByRole('button', { name: /start x/i }))
    await u.click(screen.getByRole('button', { name: /finish x/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completed: 33%/i)).toBeInTheDocument()
  })

  it('stats shows 0% completed when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/completed: 0%/i)).toBeInTheDocument()
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent', '2')
    await nav(u, 'Settings')
    await nav(u, 'Board')
    expect(within(group('Todo')).getByText('Persistent')).toBeInTheDocument()
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

  it('theme persists across view changes', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task1', '2')
    await addTask(u, 'Task2', '4')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: /todo \(0\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Task1')).not.toBeInTheDocument()
    expect(screen.queryByText('Task2')).not.toBeInTheDocument()
  })

  it('clear all tasks resets stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone', '10')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completed: 0%/i)).toBeInTheDocument()
  })

  it('doing group heading updates points correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'InProgress', '7')
    await u.click(screen.getByRole('button', { name: /start inprogress/i }))
    expect(screen.getByRole('heading', { name: /doing \(1\) — 7 pts/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /todo \(0\) — 0 pts/i })).toBeInTheDocument()
  })
})
