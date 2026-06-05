import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard stats', () => {
  it('shows total, completed, and active counts from seed data', () => {
    render(<App />)
    // seed: 3 tasks, 1 done (Buy groceries), 2 active
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-completed-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('2')
  })

  it('shows per-project counts', () => {
    render(<App />)
    expect(screen.getByTestId('project-count-p1-value')).toHaveTextContent('1') // Inbox
    expect(screen.getByTestId('project-count-p2-value')).toHaveTextContent('1') // Work
    expect(screen.getByTestId('project-count-p3-value')).toHaveTextContent('1') // Home
  })

  it('updates stats after adding a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('title-input'), 'Extra task')
    await user.click(screen.getByTestId('submit-task'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('3')
  })

  it('updates completed/active counts after toggling a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('toggle-t1')) // mark Write spec done
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-completed-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('1')
  })
})
