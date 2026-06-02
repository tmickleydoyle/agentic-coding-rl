import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: 'High' | 'Medium' | 'Low' = 'High') {
  await u.clear(screen.getByLabelText(/task title/i))
  await u.type(screen.getByLabelText(/task title/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
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

  it('navigates back to Tasks from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows Showing: 0 of 0 on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch MVP', 'High')
    expect(screen.getByText('Launch MVP')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
  })

  it('shows the priority label on each task row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write docs', 'Low')
    const row = taskRow('Write docs')
    expect(within(row).getByText('Low')).toBeInTheDocument()
  })

  it('toggles a task done via the checkbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Close deals', 'High')
    const row = taskRow('Close deals')
    const checkbox = within(row).getByLabelText(/done/i)
    expect(checkbox).not.toBeChecked()
    await u.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('filters tasks by High priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'High')
    await addTask(u, 'Low task', 'Low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('filters tasks by Medium priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Med task', 'Medium')
    await addTask(u, 'High task', 'High')
    await u.click(screen.getByRole('button', { name: 'Medium' }))
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Med task')).toBeInTheDocument()
    expect(screen.queryByText('High task')).not.toBeInTheDocument()
  })

  it('returns to All filter showing all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'High')
    await addTask(u, 'Task B', 'Low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByRole('button', { name: 'Low' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Stats shows zeros when no tasks (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Not done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Medium: 0')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })

  it('Stats reflects tasks added on Tasks view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Medium')
    await addTask(u, 'Gamma', 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })

  it('Stats shows correct Done % after toggling done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await addTask(u, 'Y', 'High')
    await u.click(within(taskRow('X')).getByLabelText(/done/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('Stats shows 100% when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finish', 'Low')
    await u.click(within(taskRow('Finish')).getByLabelText(/done/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
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
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all tasks removes tasks and Stats shows zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task 1', 'High')
    await addTask(u, 'Task 2', 'Low')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 of 0')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('task list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persisted task', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H task', 'High')
    await addTask(u, 'L task', 'Low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'true')
  })
})
