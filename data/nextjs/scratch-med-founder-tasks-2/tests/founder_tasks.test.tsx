import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
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

  it('shows Showing: 0 tasks initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch landing page', 'High')
    expect(screen.getByText('Launch landing page')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('ignores blank task names', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('shows the priority label next to the task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write pitch deck', 'Medium')
    const row = taskRow('Write pitch deck')
    expect(within(row).getByText('Medium')).toBeInTheDocument()
  })

  it('toggles a task done and undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Send invoices', 'Low')
    const row = taskRow('Send invoices')
    expect(within(row).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /mark done/i }))
    expect(within(row).getByRole('button', { name: /mark undone/i })).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /mark undone/i }))
    expect(within(row).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temporary task', 'Low')
    expect(screen.getByText('Temporary task')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete temporary task/i }))
    expect(screen.queryByText('Temporary task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('filters tasks by priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'High')
    await addTask(u, 'Low task', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('filter All shows every task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'High')
    await addTask(u, 'Task B', 'Medium')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('Stats shows correct totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'H2', 'High')
    await addTask(u, 'M1', 'Medium')
    await addTask(u, 'L1', 'Low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats Completion reflects done tasks (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'One', 'High')
    await addTask(u, 'Two', 'Low')
    await u.click(within(taskRow('One')).getByRole('button', { name: /mark done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Stats counts all tasks regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 'High')
    await addTask(u, 'P2', 'Medium')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Clear all tasks removes every task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Remove me', 'High')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('Clear all tasks resets Stats to zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('task list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })

  it('multiple tasks with different priorities show correct filter counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H', 'High')
    await addTask(u, 'M1', 'Medium')
    await addTask(u, 'M2', 'Medium')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Medium')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })
})
