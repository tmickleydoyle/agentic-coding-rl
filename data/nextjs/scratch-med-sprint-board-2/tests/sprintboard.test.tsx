import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, name: string, points: string = '1') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), name)
  await u.clear(screen.getByLabelText(/^points$/i))
  await u.type(screen.getByLabelText(/^points$/i), points)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

function taskRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Sprint Board app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('shows zero counts initially', () => {
    render(<App />)
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
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
    await addTask(u, 'Write tests', '3')
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Total points: 3')).toBeInTheDocument()
  })

  it('ignores a blank task name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('starts a task: moves it todo → doing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Fix bug', '2')
    await u.click(within(taskRow('Fix bug')).getByRole('button', { name: /start fix bug/i }))
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
  })

  it('completes a task: moves it doing → done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Deploy app', '5')
    await u.click(within(taskRow('Deploy app')).getByRole('button', { name: /start deploy app/i }))
    await u.click(within(taskRow('Deploy app')).getByRole('button', { name: /complete deploy app/i }))
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Old task', '1')
    expect(screen.getByText('Old task')).toBeInTheDocument()
    await u.click(within(taskRow('Old task')).getByRole('button', { name: /delete old task/i }))
    expect(screen.queryByText('Old task')).not.toBeInTheDocument()
    expect(screen.getByText('To Do: 0')).toBeInTheDocument()
  })

  it('Start button absent after task is started', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task X', '1')
    await u.click(within(taskRow('Task X')).getByRole('button', { name: /start task x/i }))
    expect(within(taskRow('Task X')).queryByRole('button', { name: /start task x/i })).not.toBeInTheDocument()
  })

  it('Complete button absent for todo tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task Y', '1')
    expect(within(taskRow('Task Y')).queryByRole('button', { name: /complete task y/i })).not.toBeInTheDocument()
  })

  it('filters to show only To Do tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Alpha', '1')
    await addTask(u, 'Beta', '2')
    await u.click(within(taskRow('Beta')).getByRole('button', { name: /start beta/i }))
    await u.click(screen.getByRole('button', { name: 'To Do' }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    // counts still show all
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
  })

  it('filters to show only Doing tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gamma', '3')
    await addTask(u, 'Delta', '4')
    await u.click(within(taskRow('Gamma')).getByRole('button', { name: /start gamma/i }))
    await u.click(screen.getByRole('button', { name: 'Doing' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('filters to show only Done tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Epsilon', '2')
    await u.click(within(taskRow('Epsilon')).getByRole('button', { name: /start epsilon/i }))
    await u.click(within(taskRow('Epsilon')).getByRole('button', { name: /complete epsilon/i }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Epsilon')).toBeInTheDocument()
    // counts still reflect all
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('All filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Zeta', '1')
    await addTask(u, 'Eta', '2')
    await u.click(screen.getByRole('button', { name: 'To Do' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Zeta')).toBeInTheDocument()
    expect(screen.getByText('Eta')).toBeInTheDocument()
  })

  it('Stats view shows derived totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P', '4')
    await addTask(u, 'Q', '6')
    await u.click(within(taskRow('P')).getByRole('button', { name: /start p/i }))
    await u.click(within(taskRow('P')).getByRole('button', { name: /complete p/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 2')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done points: 4')).toBeInTheDocument()
    expect(screen.getByText('To Do points: 6')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('Stats shows 0% when no tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('toggles theme and data-theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Board')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('board state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persistent task', '5')
    await nav(u, 'Stats')
    await nav(u, 'Board')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
  })

  it('total points updates after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Big task', '10')
    await addTask(u, 'Small task', '2')
    expect(screen.getByText('Total points: 12')).toBeInTheDocument()
    await u.click(within(taskRow('Big task')).getByRole('button', { name: /delete big task/i }))
    expect(screen.getByText('Total points: 2')).toBeInTheDocument()
  })

  it('Stats Doing points reflects in-progress tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'In progress', '7')
    await u.click(within(taskRow('In progress')).getByRole('button', { name: /start in progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Doing points: 7')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
  })
})
