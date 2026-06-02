// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Sprint Board (held-out)', () => {
  it('todo group starts at 0 pts with no tasks', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /todo \(0\) — 0 pts/i })).toBeInTheDocument()
  })

  it('adding two tasks to todo accumulates points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First', '4')
    await addTask(u, 'Second', '6')
    expect(screen.getByRole('heading', { name: /todo \(2\) — 10 pts/i })).toBeInTheDocument()
  })

  it('moving a task reduces todo points and increases doing points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Mover', '5')
    await u.click(screen.getByRole('button', { name: /start mover/i }))
    expect(screen.getByRole('heading', { name: /todo \(0\) — 0 pts/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(1\) — 5 pts/i })).toBeInTheDocument()
  })

  it('stats doing count and pts update after cycling', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Spec', '3')
    await addTask(u, 'Code', '7')
    await u.click(screen.getByRole('button', { name: /start code/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/doing: 1 tasks, 7 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/todo: 1 tasks, 3 pts/i)).toBeInTheDocument()
  })

  it('completed percentage is 100% when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Only', '5')
    await u.click(screen.getByRole('button', { name: /start only/i }))
    await u.click(screen.getByRole('button', { name: /finish only/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completed: 100%/i)).toBeInTheDocument()
  })

  it('deleting a task updates the group heading count and points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'RemoveMe', '9')
    await addTask(u, 'KeepMe', '2')
    await u.click(screen.getByRole('button', { name: /delete removeme/i }))
    expect(screen.getByRole('heading', { name: /todo \(1\) — 2 pts/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats total points reflects multi-status distribution', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', '2')
    await addTask(u, 'P2', '4')
    await addTask(u, 'P3', '6')
    await u.click(screen.getByRole('button', { name: /start p1/i }))
    await u.click(screen.getByRole('button', { name: /finish p1/i }))
    await u.click(screen.getByRole('button', { name: /start p2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total points: 12/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1 tasks, 2 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/doing: 1 tasks, 4 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/todo: 1 tasks, 6 pts/i)).toBeInTheDocument()
  })

  it('resetting a done task shows it back in todo on the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Cycler', '3')
    await u.click(screen.getByRole('button', { name: /start cycler/i }))
    await u.click(screen.getByRole('button', { name: /finish cycler/i }))
    await u.click(screen.getByRole('button', { name: /reset cycler/i }))
    expect(within(group('Todo')).getByText('Cycler')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0\) — 0 pts/i })).toBeInTheDocument()
  })

  it('board state survives round-trip through stats and settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Surviving', '4')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    await nav(u, 'Board')
    expect(within(group('Todo')).getByText('Surviving')).toBeInTheDocument()
  })
})
