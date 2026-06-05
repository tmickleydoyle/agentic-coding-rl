import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
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

  it('shows Showing: 0 task(s) initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 task(s)')).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch landing page', 'High')
    expect(screen.getByText('Launch landing page')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 task(s)')).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 task(s)')).toBeInTheDocument()
  })

  it('shows priority label next to each task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write blog post', 'Low')
    const row = taskRow('Write blog post')
    expect(within(row).getByText('Low')).toBeInTheDocument()
  })

  it('toggles a task to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Send invoices', 'Med')
    const checkbox = within(taskRow('Send invoices')).getByRole('checkbox', { name: /done send invoices/i })
    expect(checkbox).not.toBeChecked()
    await u.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task', 'Low')
    expect(screen.getByText('Temp task')).toBeInTheDocument()
    await u.click(within(taskRow('Temp task')).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 task(s)')).toBeInTheDocument()
  })

  it('filters by priority and updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'High')
    await addTask(u, 'Low task', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    expect(screen.getByText('Showing: 1 task(s)')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('restores all tasks when filter set back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'A', 'High')
    await addTask(u, 'B', 'Med')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Med')
    expect(screen.getByText('Showing: 1 task(s)')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing: 2 task(s)')).toBeInTheDocument()
  })

  it('Stats shows Total: 0 and Done: 0% when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('Stats reflects tasks added on Tasks view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task X', 'High')
    await addTask(u, 'Task Y', 'Low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Not done: 2')).toBeInTheDocument()
  })

  it('Stats shows correct Done count and percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 'High')
    await addTask(u, 'T2', 'High')
    await u.click(within(taskRow('T1')).getByRole('checkbox', { name: /done t1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('Stats counts per priority correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'H2', 'High')
    await addTask(u, 'M1', 'Med')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })

  it('Stats does not count filtered-out tasks differently — uses all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Visible', 'High')
    await addTask(u, 'Hidden by filter', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    // filter is High, but Stats should count all
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('deleted tasks are removed from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone', 'Med')
    await u.click(within(taskRow('Gone')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Med: 0')).toBeInTheDocument()
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

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Tasks')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('task list state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persisted task', 'Med')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
  })

  it('done state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Check me', 'High')
    await u.click(within(taskRow('Check me')).getByRole('checkbox', { name: /done check me/i }))
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(within(taskRow('Check me')).getByRole('checkbox', { name: /done check me/i })).toBeChecked()
  })

  it('Stats Not done decrements when task is toggled done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Flip me', 'Low')
    await addTask(u, 'Keep me', 'Low')
    await u.click(within(taskRow('Flip me')).getByRole('checkbox', { name: /done flip me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Not done: 1')).toBeInTheDocument()
  })
})
