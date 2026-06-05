import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task title/i))
  await u.type(screen.getByLabelText(/task title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows Showing: 0 tasks initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
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

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch landing page', 'High')
    expect(screen.getByText('Launch landing page')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('shows the priority label on the task row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write copy', 'Medium')
    const li = screen.getByText('Write copy').closest('li') as HTMLElement
    expect(within(li).getByText('Medium')).toBeInTheDocument()
  })

  it('toggles a task done via checkbox', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Send invoice', 'Low')
    const checkbox = screen.getByLabelText(/done send invoice/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    await u.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temporary task', 'Medium')
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
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('filter All shows all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'High')
    await addTask(u, 'Task B', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })

  it('stats show zeroes with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('stats reflect added tasks (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('stats update when a task is marked done (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finish deck', 'High')
    await addTask(u, 'Book flights', 'Low')
    await u.click(screen.getByLabelText(/done finish deck/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('stats count tasks by priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'H2', 'High')
    await addTask(u, 'M1', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })

  it('stats ignore the Tasks filter (shows all tasks)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 'High')
    await addTask(u, 'P2', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('toggles the theme and persists data-theme across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all tasks removes everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'One', 'High')
    await addTask(u, 'Two', 'Low')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('clear all resets stats to zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Doomed', 'Medium')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all tasks/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('task state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })

  it('completion rounds correctly for one of three done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 'High')
    await addTask(u, 'T2', 'High')
    await addTask(u, 'T3', 'High')
    await u.click(screen.getByLabelText(/done t1/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })
})
