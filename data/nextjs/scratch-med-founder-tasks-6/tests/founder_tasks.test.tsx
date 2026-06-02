import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'high') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view with empty list', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
    expect(screen.getByText('No tasks to show')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch beta', 'high')
    expect(screen.getByText('Launch beta')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('ignores blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
    expect(screen.getByText('No tasks to show')).toBeInTheDocument()
  })

  it('shows the priority label on a task row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write docs', 'low')
    expect(within(taskRow('Write docs')).getByText('low')).toBeInTheDocument()
  })

  it('toggles a task done via the checkbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Send invoice', 'med')
    const checkbox = within(taskRow('Send invoice')).getByRole('checkbox', { name: /done/i })
    expect(checkbox).not.toBeChecked()
    await u.click(checkbox)
    expect(checkbox).toBeChecked()
    await u.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task', 'low')
    expect(screen.getByText('Temp task')).toBeInTheDocument()
    await u.click(within(taskRow('Temp task')).getByRole('button', { name: /delete temp task/i }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('updates the Showing count when a task is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'high')
    await addTask(u, 'Task B', 'med')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
    await u.click(within(taskRow('Task A')).getByRole('button', { name: /delete task a/i }))
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('filters by High priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'high')
    await addTask(u, 'Low task', 'low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('filters by Med priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Med one', 'med')
    await addTask(u, 'High one', 'high')
    await u.click(screen.getByRole('button', { name: 'Med' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Med one')).toBeInTheDocument()
    expect(screen.queryByText('High one')).not.toBeInTheDocument()
  })

  it('filters by Low priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Low item', 'low')
    await addTask(u, 'High item', 'high')
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Low item')).toBeInTheDocument()
    expect(screen.queryByText('High item')).not.toBeInTheDocument()
  })

  it('shows No tasks to show when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Only high', 'high')
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByText('No tasks to show')).toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 1')).toBeInTheDocument()
  })

  it('All filter restores all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'high')
    await addTask(u, 'Beta', 'low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('Stats view shows zero stats with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
  })

  it('Stats view reflects tasks added on Tasks view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task X', 'high')
    await addTask(u, 'Task Y', 'med')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
  })

  it('Stats view updates Done count and percentage when task is toggled done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task 1', 'high')
    await addTask(u, 'Task 2', 'low')
    await u.click(within(taskRow('Task 1')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('Stats Done% rounds to whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 'high')
    await addTask(u, 'T2', 'high')
    await addTask(u, 'T3', 'high')
    await u.click(within(taskRow('T1')).getByRole('checkbox', { name: /done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset all tasks clears everything and navigates to Tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Delete me', 'high')
    await addTask(u, 'Delete me too', 'low')
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset all tasks/i }))
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
    expect(screen.getByText('No tasks to show')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persist me', 'med')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })
})
