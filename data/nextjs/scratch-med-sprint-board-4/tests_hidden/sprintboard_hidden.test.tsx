import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points?: number) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), String(points ?? 1))
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function row(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Sprint Board (held-out)', () => {
  it('initially shows all column counts as zero', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /to do \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0\)/i })).toBeInTheDocument()
  })

  it('initially shows all column points as zero', () => {
    render(<App />)
    const todoCol = col('To Do')
    const inpCol = col('In Progress')
    const doneCol = col('Done')
    expect(within(todoCol).getByText('Points: 0')).toBeInTheDocument()
    expect(within(inpCol).getByText('Points: 0')).toBeInTheDocument()
    expect(within(doneCol).getByText('Points: 0')).toBeInTheDocument()
  })

  it('multiple tasks accumulate points in To Do', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 3)
    await addTask(u, 'Y', 5)
    await addTask(u, 'Z', 2)
    expect(within(col('To Do')).getByText('Points: 10')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(3\)/i })).toBeInTheDocument()
  })

  it('Stats In Progress totals update after moving tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'task1', 4)
    await addTask(u, 'task2', 6)
    await u.click(within(row('task1')).getByRole('button', { name: /move task1 right/i }))
    await u.click(within(row('task2')).getByRole('button', { name: /move task2 right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/in progress: 2 tasks, 10 pts/i)).toBeInTheDocument()
  })

  it('completion rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'a', 1)
    await addTask(u, 'b', 1)
    await addTask(u, 'c', 1)
    await u.click(within(row('a')).getByRole('button', { name: /move a right/i }))
    await u.click(within(row('a')).getByRole('button', { name: /move a right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 33%/i)).toBeInTheDocument()
  })

  it('un-hiding done tasks restores them on Board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'restore me', 2)
    await u.click(within(row('restore me')).getByRole('button', { name: /move restore me right/i }))
    await u.click(within(row('restore me')).getByRole('button', { name: /move restore me right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(within(col('Done')).getByText('restore me')).toBeInTheDocument()
  })

  it('moving a done task left removes it from Done column count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'pull back', 3)
    await u.click(within(row('pull back')).getByRole('button', { name: /move pull back right/i }))
    await u.click(within(row('pull back')).getByRole('button', { name: /move pull back right/i }))
    expect(screen.getByRole('heading', { name: /done \(1\)/i })).toBeInTheDocument()
    await u.click(within(row('pull back')).getByRole('button', { name: /move pull back left/i }))
    expect(screen.getByRole('heading', { name: /done \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(1\)/i })).toBeInTheDocument()
  })

  it('Stats total points updates when a task moves columns', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'shift me', 7)
    await nav(u, 'Stats')
    expect(screen.getByText(/to do: 1 tasks, 7 pts/i)).toBeInTheDocument()
    await nav(u, 'Board')
    await u.click(within(row('shift me')).getByRole('button', { name: /move shift me right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/to do: 0 tasks, 0 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/in progress: 1 tasks, 7 pts/i)).toBeInTheDocument()
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

  it('Stats completion is 100% when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'finish1', 2)
    await addTask(u, 'finish2', 3)
    await u.click(within(row('finish1')).getByRole('button', { name: /move finish1 right/i }))
    await u.click(within(row('finish1')).getByRole('button', { name: /move finish1 right/i }))
    await u.click(within(row('finish2')).getByRole('button', { name: /move finish2 right/i }))
    await u.click(within(row('finish2')).getByRole('button', { name: /move finish2 right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 5/i)).toBeInTheDocument()
  })
})
