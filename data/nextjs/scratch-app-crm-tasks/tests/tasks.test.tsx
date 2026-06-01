import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today, tasks list, complete flow', () => {
  it('shows only open tasks due today on the today page', () => {
    render(<App />)
    // TODAY = 2026-06-01; t2 is due today and open; t4 is due today but done
    const list = screen.getByTestId('today-list')
    expect(within(list).getByTestId('task-t2')).toBeInTheDocument()
    expect(within(list).queryByTestId('task-t4')).not.toBeInTheDocument()
    expect(within(list).queryByTestId('task-t1')).not.toBeInTheDocument()
    expect(screen.getByTestId('today-count')).toHaveTextContent('1')
  })

  it('counts overdue open tasks', () => {
    render(<App />)
    // t1 due 2026-05-30 is overdue and open
    expect(screen.getByTestId('overdue-count')).toHaveTextContent('1')
  })

  it('lists open tasks sorted by due date on the tasks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    const items = within(screen.getByTestId('task-list')).getAllByTestId(/^task-t\d+$/)
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual(['task-t1', 'task-t2', 'task-t3'])
  })

  it('shows the contact name and due date on a task row', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('task-t1-contact')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('task-t1-due')).toHaveTextContent('2026-05-30')
  })

  it('adds a new follow-up task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.type(screen.getByTestId('title-input'), 'Call back Linus')
    await user.selectOptions(screen.getByTestId('contact-select'), 'c3')
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('task-t5')).toBeInTheDocument()
    expect(screen.getByTestId('task-t5-title')).toHaveTextContent('Call back Linus')
    expect(screen.getByTestId('task-t5-contact')).toHaveTextContent('Linus T')
  })

  it('rejects an empty task title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('submit-task'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.queryByTestId('task-t5')).not.toBeInTheDocument()
  })

  it('completing a task removes it from the open list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('toggle-t1'))
    expect(screen.queryByTestId('task-t1')).not.toBeInTheDocument()
  })

  it('completing a task moves it to the done page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('toggle-t1'))
    await user.click(screen.getByTestId('nav-done'))
    expect(screen.getByTestId('task-t1')).toBeInTheDocument()
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('done-count')).toHaveTextContent('2')
  })
})
