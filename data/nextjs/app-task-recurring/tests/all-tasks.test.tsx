import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('all tasks', () => {
  it('lists every task with schedule and next-due', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-all-tasks'))
    expect(screen.getByTestId('task-t1-schedule')).toHaveTextContent('daily')
    expect(screen.getByTestId('task-t3-schedule')).toHaveTextContent('weekly')
    expect(screen.getByTestId('task-t3-next')).toHaveTextContent('2026-06-02')
  })

  it('marks which tasks are due via data-due', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-all-tasks'))
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-due', 'true')
    expect(screen.getByTestId('task-t2')).toHaveAttribute('data-due', 'true')
    expect(screen.getByTestId('task-t3')).toHaveAttribute('data-due', 'false')
  })

  it('removes a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-all-tasks'))
    await user.click(screen.getByTestId('remove-t3'))
    expect(screen.queryByTestId('task-t3')).not.toBeInTheDocument()
  })

  it('reflects an advanced next-due after completing on the today page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('complete-t1')) // daily -> 2026-05-30
    await user.click(screen.getByTestId('nav-all-tasks'))
    expect(screen.getByTestId('task-t1-next')).toHaveTextContent('2026-05-30')
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-due', 'false')
  })
})
