import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points: string = '') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  if (points) {
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), points)
  }
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
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

  it('shows initial zero counts on the Board', () => {
    render(<App />)
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('adds a task and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Build login page', '5')
    expect(screen.getByText('Build login page')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('defaults points to 0 when field is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Zero point task')
    expect(screen.getByText(/0 pts/)).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task', '3')
    expect(screen.getByText('Temp task')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete temp task/i }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('changes status of a task and updates counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'API integration', '8')
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/status for api integration/i), 'doing')
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
  })

  it('filters tasks by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '2')
    await addTask(u, 'Task B', '3')
    await u.selectOptions(screen.getByLabelText(/status for task b/i), 'doing')
    await u.selectOptions(screen.getByLabelText(/^filter$/i), 'todo')
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.queryByText('Task B')).not.toBeInTheDocument()
  })

  it('filter does not affect status counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', '1')
    await addTask(u, 'Y', '2')
    await u.selectOptions(screen.getByLabelText(/status for y/i), 'doing')
    await u.selectOptions(screen.getByLabelText(/^filter$/i), 'done')
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('Stats shows zeros with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
    expect(screen.getByText('Done points: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added tasks correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Feature A', '10')
    await addTask(u, 'Feature B', '6')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 16')).toBeInTheDocument()
  })

  it('Stats Completion is based on done points vs total points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', '10')
    await addTask(u, 'P2', '10')
    await u.selectOptions(screen.getByLabelText(/status for p1/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Done points: 10')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Stats Completion is 0% when total points is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'No pts task')
    await u.selectOptions(screen.getByLabelText(/status for no pts task/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats updates when status changes (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Cross view task', '20')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
    await nav(u, 'Board')
    await u.selectOptions(screen.getByLabelText(/status for cross view task/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done points: 20')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
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

  it('Clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task one', '5')
    await addTask(u, 'Task two', '3')
    expect(screen.getByText('To Do: 2')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Board')
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.queryByText('Task one')).not.toBeInTheDocument()
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', '7')
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('Stats shows correct Done points after multiple tasks done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', '4')
    await addTask(u, 'T2', '6')
    await addTask(u, 'T3', '10')
    await u.selectOptions(screen.getByLabelText(/status for t1/i), 'done')
    await u.selectOptions(screen.getByLabelText(/status for t2/i), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total points: 20')).toBeInTheDocument()
    expect(screen.getByText('Done points: 10')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })
})
