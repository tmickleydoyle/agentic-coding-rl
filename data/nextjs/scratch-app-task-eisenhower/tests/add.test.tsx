import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add task', () => {
  it('adds an urgent+important task into the do quadrant', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Ship hotfix')
    await user.click(screen.getByTestId('urgent-checkbox'))
    await user.click(screen.getByTestId('important-checkbox'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('page-matrix')).toBeInTheDocument()
    expect(screen.getByTestId('task-t5')).toHaveAttribute('data-quadrant', 'do')
    expect(within(screen.getByTestId('quadrant-do')).getByText('Ship hotfix')).toBeInTheDocument()
  })

  it('adds a task with no flags into the delete quadrant', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Idle scroll')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('task-t5')).toHaveAttribute('data-quadrant', 'delete')
  })

  it('adds an important-only task into the schedule quadrant', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Write strategy')
    await user.click(screen.getByTestId('important-checkbox'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('task-t5')).toHaveAttribute('data-quadrant', 'schedule')
    expect(screen.getByTestId('count-schedule')).toHaveTextContent('2')
  })

  it('blocks adding a task with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })
})
