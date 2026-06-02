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

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows initial empty summary', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 of 0 tasks')).toBeInTheDocument()
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

  it('navigates back to Tasks view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Launch MVP')
    expect(screen.getByText('Launch MVP')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 1 tasks')).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 of 0 tasks')).toBeInTheDocument()
  })

  it('shows the priority label on each task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write docs', 'Low')
    const li = screen.getByText('Write docs').closest('li') as HTMLElement
    expect(within(li).getByText('Low')).toBeInTheDocument()
  })

  it('marks a task done with a check prefix', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'File taxes')
    await u.click(screen.getByRole('button', { name: /toggle done file taxes/i }))
    expect(screen.getByText('✓ File taxes')).toBeInTheDocument()
  })

  it('toggles a task back to incomplete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Cold outreach')
    await u.click(screen.getByRole('button', { name: /toggle done cold outreach/i }))
    await u.click(screen.getByRole('button', { name: /toggle done cold outreach/i }))
    expect(screen.getByText('Cold outreach')).toBeInTheDocument()
    expect(screen.queryByText('✓ Cold outreach')).not.toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp task')
    await u.click(screen.getByRole('button', { name: /delete temp task/i }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 of 0 tasks')).toBeInTheDocument()
  })

  it('filters by priority and updates the Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'High')
    await addTask(u, 'Beta', 'Low')
    await addTask(u, 'Gamma', 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    expect(screen.getByText('Showing: 2 of 3 tasks')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('filter All shows all tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', 'High')
    await addTask(u, 'Y', 'Medium')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'All')
    expect(screen.getByText('Showing: 2 of 2 tasks')).toBeInTheDocument()
  })

  it('stats show zeros when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('stats reflect tasks added on Tasks view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'High')
    await addTask(u, 'Task B', 'Medium')
    await addTask(u, 'Task C', 'Low')
    await u.click(screen.getByRole('button', { name: /toggle done task a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Medium: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('stats Done% is 100 when all tasks are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Solo task', 'High')
    await u.click(screen.getByRole('button', { name: /toggle done solo task/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
  })

  it('stats ignore the current filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'High')
    await addTask(u, 'L1', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'High')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
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

  it('task list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'Medium')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })

  it('delete reduces the total and summary line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Keep me', 'High')
    await addTask(u, 'Delete me', 'Low')
    await u.click(screen.getByRole('button', { name: /delete delete me/i }))
    expect(screen.getByText('Showing: 1 of 1 tasks')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })
})
