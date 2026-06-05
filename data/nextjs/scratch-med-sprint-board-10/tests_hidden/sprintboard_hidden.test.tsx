// HELD-OUT generalization tests — fresh scenarios never seen during generation.
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

describe('Sprint Board (held-out)', () => {
  it('adds multiple tasks and updates column counts correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task One', 2)
    await addTask(u, 'Task Two', 3)
    await addTask(u, 'Task Three', 1)
    expect(screen.getByRole('heading', { name: /^todo \(3\)$/i })).toBeInTheDocument()
    expect(within(sec('Todo')).getByText('Points: 6')).toBeInTheDocument()
  })

  it('moves a task to doing then to done, checking counts each step', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Journey task', 4)
    const sel = () => screen.getByLabelText(/status of journey task/i)
    await u.selectOptions(sel(), 'doing')
    expect(screen.getByRole('heading', { name: /^doing \(1\)$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^todo \(0\)$/i })).toBeInTheDocument()
    await u.selectOptions(sel(), 'done')
    expect(screen.getByRole('heading', { name: /^done \(1\)$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^doing \(0\)$/i })).toBeInTheDocument()
  })

  it('completion rounds to nearest whole percent with three tasks, one done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'p', 1)
    await addTask(u, 'q', 1)
    await addTask(u, 'r', 1)
    const selP = screen.getByLabelText(/status of p/i)
    await u.selectOptions(selP, 'done')
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
    expect(screen.getByText(/total tasks: 3/i)).toBeInTheDocument()
  })

  it('unhiding done tasks shows them again on the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Comeback task', 6)
    const sel = screen.getByLabelText(/status of comeback task/i)
    await u.selectOptions(sel, 'done')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i)) // hide
    await u.click(screen.getByLabelText(/hide done tasks/i)) // show again
    await nav(u, 'Board')
    expect(within(sec('Done')).getByText('Comeback task (Pts: 6)')).toBeInTheDocument()
  })

  it('deleting a task updates Stats total tasks and points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keep me', 5)
    await addTask(u, 'Delete me', 3)
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 5/i)).toBeInTheDocument()
  })

  it('done section shows Points: 0 when no done tasks', () => {
    render(<App />)
    expect(within(sec('Done')).getByText('Points: 0')).toBeInTheDocument()
  })

  it('stats todo pts and doing pts update after status changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'work1', 7)
    await addTask(u, 'work2', 3)
    const sel1 = screen.getByLabelText(/status of work1/i)
    await u.selectOptions(sel1, 'doing')
    await nav(u, 'Stats')
    expect(screen.getByText(/todo: 1 tasks, 3 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/doing: 1 tasks, 7 pts/i)).toBeInTheDocument()
  })

  it('theme toggle cycles light -> dark -> light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})
