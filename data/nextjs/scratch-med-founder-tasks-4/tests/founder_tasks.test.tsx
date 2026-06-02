import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows zero tasks initially', () => {
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

  it('navigates back to Tasks from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix login bug', 'High')
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('adds tasks with different priorities', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Urgent thing', 'High')
    await addTask(u, 'Medium thing', 'Medium')
    await addTask(u, 'Low thing', 'Low')
    expect(screen.getByText('Showing: 3 tasks')).toBeInTheDocument()
  })

  it('marks a task as done and shows (done) label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', 'Medium')
    await u.click(screen.getByRole('button', { name: /mark done write tests/i }))
    expect(screen.getByText('Write tests (done)')).toBeInTheDocument()
  })

  it('marks a done task undone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy app', 'High')
    await u.click(screen.getByRole('button', { name: /mark done deploy app/i }))
    await u.click(screen.getByRole('button', { name: /mark undone deploy app/i }))
    expect(screen.queryByText('Deploy app (done)')).not.toBeInTheDocument()
    expect(screen.getByText('Deploy app')).toBeInTheDocument()
  })

  it('filters by High priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'High')
    await addTask(u, 'Low task', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
  })

  it('filters by Medium priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Med task', 'Medium')
    await addTask(u, 'High task', 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Medium')
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
    expect(screen.getByText('Med task')).toBeInTheDocument()
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

  it('stats show zeros with no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('stats reflect added tasks (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
  })

  it('stats reflect done toggle (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task one', 'High')
    await addTask(u, 'Task two', 'Low')
    await u.click(screen.getByRole('button', { name: /mark done task one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Remaining: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('stats priority counts are correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'H2', 'High')
    await addTask(u, 'M1', 'Medium')
    await addTask(u, 'L1', 'Low')
    await nav(u, 'Stats')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('done percentage rounds to whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', 'High')
    await addTask(u, 'T2', 'High')
    await addTask(u, 'T3', 'High')
    await u.click(screen.getByRole('button', { name: /mark done t1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('tasks state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persisted task', 'Low')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
  })

  it('toggles theme in Settings and data-theme attribute updates', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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

  it('filter does not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High one', 'High')
    await addTask(u, 'Low one', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })
})
