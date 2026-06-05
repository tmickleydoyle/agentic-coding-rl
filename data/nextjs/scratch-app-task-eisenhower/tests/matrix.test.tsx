import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('matrix', () => {
  it('places each seeded task in its quadrant', () => {
    render(<App />)
    expect(within(screen.getByTestId('quadrant-do')).getByText('Fix outage')).toBeInTheDocument()
    expect(within(screen.getByTestId('quadrant-schedule')).getByText('Plan roadmap')).toBeInTheDocument()
    expect(within(screen.getByTestId('quadrant-delegate')).getByText('Answer emails')).toBeInTheDocument()
    expect(within(screen.getByTestId('quadrant-delete')).getByText('Browse forums')).toBeInTheDocument()
  })

  it('shows per-quadrant counts', () => {
    render(<App />)
    expect(screen.getByTestId('count-do')).toHaveTextContent('1')
    expect(screen.getByTestId('count-schedule')).toHaveTextContent('1')
    expect(screen.getByTestId('count-delegate')).toHaveTextContent('1')
    expect(screen.getByTestId('count-delete')).toHaveTextContent('1')
  })

  it('marks the quadrant of each task via data-quadrant', () => {
    render(<App />)
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-quadrant', 'do')
    expect(screen.getByTestId('task-t4')).toHaveAttribute('data-quadrant', 'delete')
  })

  it('omits the move button matching the task own quadrant', () => {
    render(<App />)
    // t1 is in "do" -> no do-t1 button, but schedule/delegate present
    expect(screen.queryByTestId('do-t1')).not.toBeInTheDocument()
    expect(screen.getByTestId('schedule-t1')).toBeInTheDocument()
    expect(screen.getByTestId('delegate-t1')).toBeInTheDocument()
  })

  it('moves a task from delegate to do and updates counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('do-t3')) // Answer emails delegate -> do
    expect(screen.getByTestId('task-t3')).toHaveAttribute('data-quadrant', 'do')
    expect(screen.getByTestId('count-do')).toHaveTextContent('2')
    expect(screen.getByTestId('count-delegate')).toHaveTextContent('0')
  })

  it('moves a task to schedule', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('schedule-t1')) // do -> schedule
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-quadrant', 'schedule')
    expect(within(screen.getByTestId('quadrant-schedule')).getByText('Fix outage')).toBeInTheDocument()
  })

  it('deletes a task entirely', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('delete-t2'))
    expect(screen.queryByTestId('task-t2')).not.toBeInTheDocument()
    expect(screen.getByTestId('count-schedule')).toHaveTextContent('0')
  })
})
