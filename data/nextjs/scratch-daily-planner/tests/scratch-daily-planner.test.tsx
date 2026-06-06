import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Daily Planner', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /daily planner/i })).toBeInTheDocument()
  })

  it('shows 4 seed tasks', () => {
    expect(screen.getAllByTestId('task-item')).toHaveLength(4)
  })

  it('shows total count', () => {
    expect(screen.getByTestId('total-tasks').textContent).toBe('Total: 4')
  })

  it('shows done count from seed', () => {
    expect(screen.getByTestId('done-tasks').textContent).toBe('Done: 1')
  })

  it('shows pending count from seed', () => {
    expect(screen.getByTestId('pending-tasks').textContent).toBe('Pending: 3')
  })

  it('task times are displayed', () => {
    const times = screen.getAllByTestId('task-time')
    expect(times[0].textContent).toBe('09:00')
    expect(times[1].textContent).toBe('10:30')
  })

  it('task priorities are displayed', () => {
    const priorities = screen.getAllByTestId('task-priority')
    expect(priorities[0].textContent).toBe('high')
    expect(priorities[2].textContent).toBe('low')
  })

  it('completed task has done class', () => {
    const items = screen.getAllByTestId('task-item')
    expect(items[2].className).toContain('done')
  })

  it('checking a task updates done count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText(/mark team standup done/i))
    expect(screen.getByTestId('done-tasks').textContent).toBe('Done: 2')
    expect(screen.getByTestId('pending-tasks').textContent).toBe('Pending: 2')
  })

  it('unchecking a task updates done count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText(/mark lunch break done/i))
    expect(screen.getByTestId('done-tasks').textContent).toBe('Done: 0')
  })

  it('adds a new task', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/task title/i), 'Evening walk')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(5)
    expect(screen.getByText('Evening walk')).toBeInTheDocument()
  })

  it('clears title input after add', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/task title/i)
    await user.type(input, 'New task')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('ignores empty title on add', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(4)
  })

  it('clear done removes completed tasks', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getAllByTestId('task-item')).toHaveLength(3)
    expect(screen.getByTestId('done-tasks').textContent).toBe('Done: 0')
  })

  it('updates total after clear done', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /clear done/i }))
    expect(screen.getByTestId('total-tasks').textContent).toBe('Total: 3')
  })
})
