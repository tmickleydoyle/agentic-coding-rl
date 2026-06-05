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

describe('Sprint Board (held-out)', () => {
  it('multiple tasks accumulate total points correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Task A', '3')
    await addTask(u, 'Task B', '5')
    await addTask(u, 'Task C', '2')
    expect(screen.getByText('Total points: 10')).toBeInTheDocument()
  })

  it('Stats completion rounds down to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'one', '1')
    await addTask(u, 'two', '1')
    await addTask(u, 'three', '1')
    await u.click(within(taskRow('one')).getByRole('button', { name: /start one/i }))
    await u.click(within(taskRow('one')).getByRole('button', { name: /complete one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('Done filter hides todo and doing tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finished', '2')
    await addTask(u, 'Not done', '1')
    await u.click(within(taskRow('Finished')).getByRole('button', { name: /start finished/i }))
    await u.click(within(taskRow('Finished')).getByRole('button', { name: /complete finished/i }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Finished')).toBeInTheDocument()
    expect(screen.queryByText('Not done')).not.toBeInTheDocument()
  })

  it('counts on board always include filtered-out tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Visible', '3')
    await addTask(u, 'Hidden', '4')
    await u.click(within(taskRow('Hidden')).getByRole('button', { name: /start hidden/i }))
    await u.click(screen.getByRole('button', { name: 'To Do' }))
    expect(screen.getByText('To Do: 1')).toBeInTheDocument()
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    expect(screen.getByText('Total points: 7')).toBeInTheDocument()
  })

  it('deleting a doing task updates Doing count and total points', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Del me', '8')
    await u.click(within(taskRow('Del me')).getByRole('button', { name: /start del me/i }))
    expect(screen.getByText('Doing: 1')).toBeInTheDocument()
    await u.click(within(taskRow('Del me')).getByRole('button', { name: /delete del me/i }))
    expect(screen.getByText('Doing: 0')).toBeInTheDocument()
    expect(screen.getByText('Total points: 0')).toBeInTheDocument()
  })

  it('Stats reflects deleted tasks immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Gone', '5')
    await addTask(u, 'Stays', '3')
    await u.click(within(taskRow('Gone')).getByRole('button', { name: /delete gone/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total tasks: 1')).toBeInTheDocument()
    expect(screen.getByText('To Do points: 3')).toBeInTheDocument()
  })

  it('theme toggle switches back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats Doing points: 0 when no tasks in doing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Solo', '9')
    await nav(u, 'Stats')
    expect(screen.getByText('Doing points: 0')).toBeInTheDocument()
  })

  it('completing all tasks shows Done: 100% in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'R1', '1')
    await addTask(u, 'R2', '1')
    await u.click(within(taskRow('R1')).getByRole('button', { name: /start r1/i }))
    await u.click(within(taskRow('R1')).getByRole('button', { name: /complete r1/i }))
    await u.click(within(taskRow('R2')).getByRole('button', { name: /start r2/i }))
    await u.click(within(taskRow('R2')).getByRole('button', { name: /complete r2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
  })
})
