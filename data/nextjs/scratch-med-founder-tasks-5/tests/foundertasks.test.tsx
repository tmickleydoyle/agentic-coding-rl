import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, priority: 'high' | 'med' | 'low' = 'med') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.selectOptions(screen.getByLabelText('Priority'), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker', () => {
  it('starts on the Tasks view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
  })

  it('shows Showing: 0 tasks on empty list', () => {
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
    await addTask(u, 'Write landing page', 'high')
    expect(screen.getByText('Write landing page')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('ignores blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('shows task priority label in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Pitch deck', 'high')
    const item = screen.getByText('Pitch deck').closest('li') as HTMLElement
    expect(within(item).getByText('high')).toBeInTheDocument()
  })

  it('toggles a task to done and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Send invoices', 'low')
    const doneBtn = screen.getByRole('button', { name: 'Mark done' })
    await u.click(doneBtn)
    expect(screen.getByRole('button', { name: 'Mark undone' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Mark undone' }))
    expect(screen.getByRole('button', { name: 'Mark done' })).toBeInTheDocument()
  })

  it('filters tasks by priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'high')
    await addTask(u, 'Low task', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    expect(screen.getByText('High task')).toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 tasks')).toBeInTheDocument()
  })

  it('filter all shows every task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 'high')
    await addTask(u, 'Beta', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'all')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 tasks')).toBeInTheDocument()
  })

  it('Stats shows Total: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done %: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added tasks (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 'high')
    await addTask(u, 'Task B', 'med')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
  })

  it('Stats Done count updates when task toggled done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finish report', 'med')
    await u.click(screen.getByRole('button', { name: 'Mark done' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done %: 100%')).toBeInTheDocument()
  })

  it('Stats Done % is 50% when half done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First', 'high')
    await addTask(u, 'Second', 'low')
    await u.click(screen.getAllByRole('button', { name: 'Mark done' })[0])
    await nav(u, 'Stats')
    expect(screen.getByText('Done %: 50%')).toBeInTheDocument()
  })

  it('Stats counts all tasks ignoring active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H1', 'high')
    await addTask(u, 'L1', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('theme starts as light with data-theme attribute', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Tasks')
    await nav(u, 'Settings')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('task list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 'high')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Med task', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by priority'), 'high')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 0 tasks')).toBeInTheDocument()
  })

  it('adding multiple tasks updates Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'One', 'low')
    await addTask(u, 'Two', 'low')
    await addTask(u, 'Three', 'high')
    expect(screen.getByText('Showing: 3 tasks')).toBeInTheDocument()
  })
})
