import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points: string) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), points)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows zero counts on empty board', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doing \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
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

  it('navigates back to Board from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('adds a task and shows it in To Do', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Design login page', '5')
    const todo = screen.getByRole('region', { name: 'To Do' })
    expect(within(todo).getByText('Design login page')).toBeInTheDocument()
  })

  it('updates the To Do count and points after adding a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', '3')
    expect(screen.getByRole('heading', { name: /to do \(1 tasks, 3 pts\)/i })).toBeInTheDocument()
  })

  it('ignores a task with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), '5')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
  })

  it('ignores a task with zero points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/task name/i), 'Bad task')
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), '0')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
  })

  it('changes a task status to doing via the dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Implement API', '8')
    await u.selectOptions(
      within(taskRow('Implement API')).getByRole('combobox', { name: /status of implement api/i }),
      'doing'
    )
    expect(screen.getByRole('heading', { name: /doing \(1 tasks, 8 pts\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
  })

  it('changes a task status to done via the dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Ship feature', '13')
    await u.selectOptions(
      within(taskRow('Ship feature')).getByRole('combobox', { name: /status of ship feature/i }),
      'done'
    )
    expect(screen.getByRole('heading', { name: /done \(1 tasks, 13 pts\)/i })).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Remove me', '2')
    await u.click(within(taskRow('Remove me')).getByRole('button', { name: /delete remove me/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0 tasks, 0 pts\)/i })).toBeInTheDocument()
  })

  it('accumulates points across multiple tasks in a section', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '4')
    await addTask(u, 'Task B', '6')
    expect(screen.getByRole('heading', { name: /to do \(2 tasks, 10 pts\)/i })).toBeInTheDocument()
  })

  it('stats view shows total tasks and points (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '5')
    await addTask(u, 'Beta', '3')
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 8/i)).toBeInTheDocument()
  })

  it('stats view shows 0% completion when no tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Pending', '5')
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('stats view shows correct completion percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task 1', '3')
    await addTask(u, 'Task 2', '3')
    await addTask(u, 'Task 3', '3')
    await addTask(u, 'Task 4', '3')
    await u.selectOptions(
      within(taskRow('Task 1')).getByRole('combobox', { name: /status of task 1/i }),
      'done'
    )
    await u.selectOptions(
      within(taskRow('Task 2')).getByRole('combobox', { name: /status of task 2/i }),
      'done'
    )
    await nav(u, 'Stats')
    expect(screen.getByText(/done tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
  })

  it('stats view shows 0% completion with no tasks at all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
  })

  it('toggles theme and reflects data-theme attribute', async () => {
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
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides done tasks on board when Hide done tasks is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finished task', '5')
    await u.selectOptions(
      within(taskRow('Finished task')).getByRole('combobox', { name: /status of finished task/i }),
      'done'
    )
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    const doneSection = screen.getByRole('region', { name: 'Done' })
    expect(within(doneSection).queryByText('Finished task')).not.toBeInTheDocument()
  })

  it('done tasks still count in Stats when hidden on board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Hidden but counted', '7')
    await u.selectOptions(
      within(taskRow('Hidden but counted')).getByRole('combobox', { name: /status of hidden but counted/i }),
      'done'
    )
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Stats')
    expect(screen.getByText(/done tasks: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/done points: 7/i)).toBeInTheDocument()
  })

  it('board state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persisted task', '4')
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
  })
})
