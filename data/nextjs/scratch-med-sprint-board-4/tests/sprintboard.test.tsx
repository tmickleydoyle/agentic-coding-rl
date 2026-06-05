import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string, points?: number) {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), String(points ?? 1))
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0\)/i })).toBeInTheDocument()
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

  it('adds a task to To Do column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix login bug', 3)
    expect(within(col('To Do')).getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(1\)/i })).toBeInTheDocument()
  })

  it('shows points in column total after adding tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', 4)
    await addTask(u, 'Task B', 6)
    expect(within(col('To Do')).getByText('Points: 10')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /to do \(0\)/i })).toBeInTheDocument()
  })

  it('Move left is disabled in To Do column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'New task', 2)
    expect(within(taskRow('New task')).getByRole('button', { name: /move new task left/i })).toBeDisabled()
  })

  it('moves a task right into In Progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Build API', 5)
    await u.click(within(taskRow('Build API')).getByRole('button', { name: /move build api right/i }))
    expect(within(col('In Progress')).getByText('Build API')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(1\)/i })).toBeInTheDocument()
  })

  it('moves a task from In Progress to Done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write tests', 3)
    await u.click(within(taskRow('Write tests')).getByRole('button', { name: /move write tests right/i }))
    await u.click(within(taskRow('Write tests')).getByRole('button', { name: /move write tests right/i }))
    expect(within(col('Done')).getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(1\)/i })).toBeInTheDocument()
  })

  it('Move right is disabled in Done column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy', 2)
    await u.click(within(taskRow('Deploy')).getByRole('button', { name: /move deploy right/i }))
    await u.click(within(taskRow('Deploy')).getByRole('button', { name: /move deploy right/i }))
    expect(within(taskRow('Deploy')).getByRole('button', { name: /move deploy right/i })).toBeDisabled()
  })

  it('moves a task back left out of In Progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Review PR', 1)
    await u.click(within(taskRow('Review PR')).getByRole('button', { name: /move review pr right/i }))
    await u.click(within(taskRow('Review PR')).getByRole('button', { name: /move review pr left/i }))
    expect(within(col('To Do')).getByText('Review PR')).toBeInTheDocument()
  })

  it('column points update when task moves', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Migrate DB', 8)
    expect(within(col('To Do')).getByText('Points: 8')).toBeInTheDocument()
    expect(within(col('In Progress')).getByText('Points: 0')).toBeInTheDocument()
    await u.click(within(taskRow('Migrate DB')).getByRole('button', { name: /move migrate db right/i }))
    expect(within(col('To Do')).getByText('Points: 0')).toBeInTheDocument()
    expect(within(col('In Progress')).getByText('Points: 8')).toBeInTheDocument()
  })

  it('Stats shows zero state when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 0%/i)).toBeInTheDocument()
  })

  it('Stats reflects tasks added on Board (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', 3)
    await addTask(u, 'Beta', 7)
    await nav(u, 'Stats')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total points: 10/i)).toBeInTheDocument()
    expect(screen.getByText(/to do: 2 tasks, 10 pts/i)).toBeInTheDocument()
  })

  it('Stats completion percentage is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'One', 2)
    await addTask(u, 'Two', 2)
    await addTask(u, 'Three', 2)
    await addTask(u, 'Four', 2)
    await u.click(within(taskRow('One')).getByRole('button', { name: /move one right/i }))
    await u.click(within(taskRow('One')).getByRole('button', { name: /move one right/i }))
    await u.click(within(taskRow('Two')).getByRole('button', { name: /move two right/i }))
    await u.click(within(taskRow('Two')).getByRole('button', { name: /move two right/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 2 tasks, 4 pts/i)).toBeInTheDocument()
  })

  it('toggling theme changes data-theme attribute', async () => {
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
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Hide done tasks hides Done column items on the Board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Completed task', 4)
    await u.click(within(taskRow('Completed task')).getByRole('button', { name: /move completed task right/i }))
    await u.click(within(taskRow('Completed task')).getByRole('button', { name: /move completed task right/i }))
    expect(within(col('Done')).getByText('Completed task')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(within(col('Done')).queryByText('Completed task')).not.toBeInTheDocument()
  })

  it('Done column count still correct when tasks are hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Hidden task', 2)
    await u.click(within(taskRow('Hidden task')).getByRole('button', { name: /move hidden task right/i }))
    await u.click(within(taskRow('Hidden task')).getByRole('button', { name: /move hidden task right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: /done \(1\)/i })).toBeInTheDocument()
  })

  it('Stats still counts Done tasks when hidden on Board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Done item', 5)
    await u.click(within(taskRow('Done item')).getByRole('button', { name: /move done item right/i }))
    await u.click(within(taskRow('Done item')).getByRole('button', { name: /move done item right/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Stats')
    expect(screen.getByText(/done: 1 tasks, 5 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument()
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', 3)
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(within(col('To Do')).getByText('Persistent task')).toBeInTheDocument()
  })
})
