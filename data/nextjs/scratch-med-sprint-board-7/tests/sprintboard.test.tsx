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

describe('Sprint Board app', () => {
  it('starts on Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows nav buttons for all three views', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
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

  it('shows initial counts of 0', () => {
    render(<App />)
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix login bug', '3')
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), '5')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('ignores zero points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/task name/i), 'Zero pts task')
    await u.clear(screen.getByLabelText(/^points$/i))
    await u.type(screen.getByLabelText(/^points$/i), '0')
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('changes task status via selector and updates counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Design mockups', '5')
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Status for Design mockups'), 'doing')
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Status for Design mockups'), 'done')
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old task', '2')
    expect(screen.getByText('Old task')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Old task' }))
    expect(screen.queryByText('Old task')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('stats view shows zeros when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
    expect(screen.getByText('Points done: 0')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 0')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('stats view reflects tasks added on board (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '4')
    await addTask(u, 'Task B', '6')
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('Total points: 10')).toBeInTheDocument()
    expect(screen.getByText('Points done: 0')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 10')).toBeInTheDocument()
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument()
  })

  it('stats view updates after marking tasks done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '3')
    await addTask(u, 'Beta', '7')
    await u.selectOptions(screen.getByLabelText('Status for Alpha'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total points: 10')).toBeInTheDocument()
    expect(screen.getByText('Points done: 3')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 7')).toBeInTheDocument()
    expect(screen.getByText('Progress: 30%')).toBeInTheDocument()
  })

  it('progress rounds to whole number percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'X', '1')
    await addTask(u, 'Y', '1')
    await addTask(u, 'Z', '1')
    await u.selectOptions(screen.getByLabelText('Status for X'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Progress: 33%')).toBeInTheDocument()
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', '8')
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
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
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hide done tasks hides them on board but still counts in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Completed item', '5')
    await u.selectOptions(screen.getByLabelText('Status for Completed item'), 'done')
    expect(screen.getByText('Completed item')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.queryByText('Completed item')).not.toBeInTheDocument()
    // count still shows 1 in Done
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    // stats still sees it
    await nav(u, 'Stats')
    expect(screen.getByText('Points done: 5')).toBeInTheDocument()
  })

  it('un-hiding done tasks brings them back on board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Hidden then shown', '2')
    await u.selectOptions(screen.getByLabelText('Status for Hidden then shown'), 'done')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await u.click(screen.getByLabelText(/hide done tasks/i))
    await nav(u, 'Board')
    expect(screen.getByText('Hidden then shown')).toBeInTheDocument()
  })

  it('multiple tasks with mixed statuses compute correct points remaining', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'T1', '4')
    await addTask(u, 'T2', '6')
    await addTask(u, 'T3', '10')
    await u.selectOptions(screen.getByLabelText('Status for T1'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for T2'), 'doing')
    await nav(u, 'Stats')
    expect(screen.getByText('Total points: 20')).toBeInTheDocument()
    expect(screen.getByText('Points done: 4')).toBeInTheDocument()
    expect(screen.getByText('Points remaining: 16')).toBeInTheDocument()
    expect(screen.getByText('Progress: 20%')).toBeInTheDocument()
  })
})
