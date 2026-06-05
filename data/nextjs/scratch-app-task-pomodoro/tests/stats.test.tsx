import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('stats', () => {
  it('shows the total of all sessions from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('3') // 2 + 0 + 1
  })

  it('shows the number of completed tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('completed-tasks')).toHaveTextContent('1') // only t3
  })

  it('lists per-task session breakdown', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-t1-sessions')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-t2-sessions')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-t3-sessions')).toHaveTextContent('1')
  })

  it('updates completed count after toggling a task done', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('done-t1'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('completed-tasks')).toHaveTextContent('2')
  })
})
