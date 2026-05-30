import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToTasks(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-tasks'))
}

describe('task flow', () => {
  it('lists seeded tasks on the tasks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    const list = screen.getByTestId('task-list')
    expect(within(list).getByText('Write spec')).toBeInTheDocument()
    expect(within(list).getByText('Buy groceries')).toBeInTheDocument()
    expect(within(list).getByText('Triage inbox')).toBeInTheDocument()
  })

  it('blocks submitting a task with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    // still on the new page, did not navigate away
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })

  it('adds a task and navigates to the tasks list where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('title-input'), 'Ship release')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(within(screen.getByTestId('task-list')).getByText('Ship release')).toBeInTheDocument()
  })

  it('toggles a task complete and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    const row = screen.getByTestId('task-t1')
    expect(row).toHaveAttribute('data-done', 'false')
    await user.click(screen.getByTestId('toggle-t1'))
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'true')
    await user.click(screen.getByTestId('toggle-t1'))
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'false')
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    expect(screen.getByTestId('task-t3')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-t3'))
    expect(screen.queryByTestId('task-t3')).not.toBeInTheDocument()
  })

  it('filters tasks by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'done')
    expect(screen.getByTestId('task-t2')).toBeInTheDocument() // Buy groceries is done
    expect(screen.queryByTestId('task-t1')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('status-filter'), 'active')
    expect(screen.getByTestId('task-t1')).toBeInTheDocument()
    expect(screen.queryByTestId('task-t2')).not.toBeInTheDocument()
  })

  it('filters tasks by project', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    await user.selectOptions(screen.getByTestId('project-filter'), 'p2') // Work
    expect(screen.getByTestId('task-t1')).toBeInTheDocument()
    expect(screen.queryByTestId('task-t2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('task-t3')).not.toBeInTheDocument()
  })

  it('shows an empty state when no tasks match the filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToTasks(user)
    // Work project has only one active task; filtering Work + done yields nothing
    await user.selectOptions(screen.getByTestId('project-filter'), 'p2')
    await user.selectOptions(screen.getByTestId('status-filter'), 'done')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('task-list')).not.toBeInTheDocument()
  })
})
