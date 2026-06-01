import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('tasks and progress', () => {
  it('the tasks page totals all tasks and done count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('tasks-total')).toHaveTextContent('6')
    expect(screen.getByTestId('tasks-done')).toHaveTextContent('3')
  })

  it('the tasks page shows the hire name per task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('row-task-t1-hire')).toHaveTextContent('Ada')
    expect(screen.getByTestId('row-task-t5-hire')).toHaveTextContent('Grace')
    expect(screen.getByTestId('row-task-t3-label')).toHaveTextContent('Meet team')
  })

  it('toggling on the tasks page updates the done total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('row-toggle-t3'))
    expect(screen.getByTestId('row-task-t3')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('tasks-done')).toHaveTextContent('4')
  })

  it('the progress page shows per-hire done/total/percent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('progress-h1-done')).toHaveTextContent('2')
    expect(screen.getByTestId('progress-h1-total')).toHaveTextContent('4')
    expect(screen.getByTestId('progress-h1-percent')).toHaveTextContent('50')
    expect(screen.getByTestId('progress-h3-total')).toHaveTextContent('0')
    expect(screen.getByTestId('progress-h3-percent')).toHaveTextContent('0')
  })

  it('computes the overall percent across hires', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    // (50 + 50 + 0) / 3 = 33
    expect(screen.getByTestId('overall-percent')).toHaveTextContent('33')
  })

  it('a task toggle is reflected on the progress page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    await user.click(screen.getByTestId('row-toggle-t6'))
    await user.click(screen.getByTestId('nav-progress'))
    // h2 now 2 of 2 -> 100
    expect(screen.getByTestId('progress-h2-percent')).toHaveTextContent('100')
  })
})
