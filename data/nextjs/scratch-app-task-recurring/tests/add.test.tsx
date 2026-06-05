import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add task', () => {
  it('adds a daily task due today and navigates to all-tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Stretch')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('page-all-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('task-t4-title')).toHaveTextContent('Stretch')
    expect(screen.getByTestId('task-t4-next')).toHaveTextContent('2026-05-29')
    expect(screen.getByTestId('task-t4')).toHaveAttribute('data-due', 'true')
  })

  it('adds a weekly task with the chosen schedule', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Review goals')
    await user.selectOptions(screen.getByTestId('schedule-select'), 'weekly')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('task-t4-schedule')).toHaveTextContent('weekly')
  })

  it('blocks adding a task with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('a newly added task appears in today (due now)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Hydrate')
    await user.click(screen.getByTestId('submit-task'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('due-t4')).toBeInTheDocument()
    expect(screen.getByTestId('due-count')).toHaveTextContent('3')
  })
})
