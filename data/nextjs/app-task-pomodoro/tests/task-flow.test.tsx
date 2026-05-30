import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('task flow', () => {
  it('lists the seeded tasks with session counts', () => {
    render(<App />)
    const list = screen.getByTestId('task-list')
    expect(within(list).getByText('Write report')).toBeInTheDocument()
    expect(screen.getByTestId('session-count-t1')).toHaveTextContent('2')
    expect(screen.getByTestId('session-count-t2')).toHaveTextContent('0')
    expect(screen.getByTestId('session-count-t3')).toHaveTextContent('1')
  })

  it('reflects done state via data-done', () => {
    render(<App />)
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'false')
    expect(screen.getByTestId('task-t3')).toHaveAttribute('data-done', 'true')
  })

  it('adds a task with a fresh id', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('task-title-input'), 'New task')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('task-t4')).toBeInTheDocument()
    expect(screen.getByTestId('session-count-t4')).toHaveTextContent('0')
  })

  it('blocks adding a task with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.queryByTestId('task-t4')).not.toBeInTheDocument()
  })

  it('toggles done state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('done-t2'))
    expect(screen.getByTestId('task-t2')).toHaveAttribute('data-done', 'true')
    await user.click(screen.getByTestId('done-t2'))
    expect(screen.getByTestId('task-t2')).toHaveAttribute('data-done', 'false')
  })

  it('removes a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-t2'))
    expect(screen.queryByTestId('task-t2')).not.toBeInTheDocument()
  })

  it('focus button selects the task and navigates to focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('focus-t2'))
    expect(screen.getByTestId('page-focus')).toBeInTheDocument()
    expect(screen.getByTestId('focus-task')).toHaveTextContent('Review PR')
  })
})
