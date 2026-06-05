// Held-out generalization tests — different inputs, edge cases, cross-view paths.
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

describe('Sprint Board (held-out)', () => {
  it('stats completion rounds to nearest integer (1 of 3)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 1)
    await addTask(u, 'T2', 1)
    await addTask(u, 'T3', 1)
    await u.selectOptions(within(taskRow('T1')).getByRole('combobox'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('counters split across all three statuses correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'A', 2)
    await addTask(u, 'B', 3)
    await addTask(u, 'C', 4)
    await u.selectOptions(within(taskRow('B')).getByRole('combobox'), 'doing')
    await u.selectOptions(within(taskRow('C')).getByRole('combobox'), 'done')
    expect(screen.getByText('To Do: 1 tasks, 2 pts')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1 tasks, 3 pts')).toBeInTheDocument()
    expect(screen.getByText('Done: 1 tasks, 4 pts')).toBeInTheDocument()
  })

  it('deleting a done task reduces stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Zap', 6)
    await u.selectOptions(within(taskRow('Zap')).getByRole('combobox'), 'done')
    await u.click(screen.getByRole('button', { name: /delete zap/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Points done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('filter switching restores all tasks on All option', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Foo', 1)
    await addTask(u, 'Bar', 1)
    await u.selectOptions(within(taskRow('Bar')).getByRole('combobox'), 'doing')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'doing')
    expect(screen.queryByText('Foo')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(screen.getByText('Bar')).toBeInTheDocument()
  })

  it('points done in stats equals sum of done task points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'D1', 3)
    await addTask(u, 'D2', 7)
    await addTask(u, 'D3', 2)
    await u.selectOptions(within(taskRow('D1')).getByRole('combobox'), 'done')
    await u.selectOptions(within(taskRow('D3')).getByRole('combobox'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Points done: 5')).toBeInTheDocument()
    expect(screen.getByText('Done: 2 tasks')).toBeInTheDocument()
    expect(screen.getByText('Total points: 12')).toBeInTheDocument()
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

  it('clear all then add new tasks starts fresh', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old', 9)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Board')
    await addTask(u, 'Fresh', 2)
    expect(screen.getByText('Fresh')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1 tasks, 2 pts')).toBeInTheDocument()
    expect(screen.queryByText('Old')).not.toBeInTheDocument()
  })

  it('100% completion when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'M1', 1)
    await addTask(u, 'M2', 1)
    await u.selectOptions(within(taskRow('M1')).getByRole('combobox'), 'done')
    await u.selectOptions(within(taskRow('M2')).getByRole('combobox'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })
})
