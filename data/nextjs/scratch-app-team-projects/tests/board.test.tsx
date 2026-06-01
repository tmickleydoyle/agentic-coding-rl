import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('board and members', () => {
  it('groups tasks by status with counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('column-todo-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-doing-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-done-count')).toHaveTextContent('1')
  })

  it('places each task in the right column', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(within(screen.getByTestId('column-doing')).getByTestId('board-task-k1')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-todo')).getByTestId('board-task-k2')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-done')).getByTestId('board-task-k3')).toBeInTheDocument()
  })

  it('advances a task from todo to doing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    await user.click(screen.getByTestId('advance-k2'))
    expect(within(screen.getByTestId('column-doing')).getByTestId('board-task-k2')).toBeInTheDocument()
    expect(screen.getByTestId('column-todo-count')).toHaveTextContent('0')
    expect(screen.getByTestId('column-doing-count')).toHaveTextContent('2')
  })

  it('disables advance on a done task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('advance-k3')).toBeDisabled()
  })

  it('advancing a doing task moves it to done', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    await user.click(screen.getByTestId('advance-k1'))
    expect(within(screen.getByTestId('column-done')).getByTestId('board-task-k1')).toBeInTheDocument()
    expect(screen.getByTestId('advance-k1')).toBeDisabled()
  })

  it('shows per-member workload on the members page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-m1-load')).toHaveTextContent('2')
    expect(screen.getByTestId('member-m2-load')).toHaveTextContent('1')
    expect(screen.getByTestId('member-m3-load')).toHaveTextContent('0')
  })

  it('persists theme across navigation when toggled via context default', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
