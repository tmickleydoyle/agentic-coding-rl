import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('hires list and detail', () => {
  it('lists seeded hires with their completion percent', () => {
    render(<App />)
    expect(screen.getByTestId('hire-h1-name')).toHaveTextContent('Ada')
    expect(screen.getByTestId('hire-h1-role')).toHaveTextContent('Engineer')
    // h1 has 2 of 4 done -> 50%
    expect(screen.getByTestId('hire-h1-percent')).toHaveTextContent('50')
    // h2 has 1 of 2 done -> 50%
    expect(screen.getByTestId('hire-h2-percent')).toHaveTextContent('50')
    // h3 has no tasks -> 0%
    expect(screen.getByTestId('hire-h3-percent')).toHaveTextContent('0')
  })

  it('opens a hire detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    expect(screen.getByTestId('page-hire-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Ada')
    expect(screen.getByTestId('detail-role')).toHaveTextContent('Engineer')
    expect(screen.getByTestId('nav-hire-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('detail page lists only that hire tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    const list = screen.getByTestId('detail-tasks')
    expect(within(list).getByTestId('task-t1')).toBeInTheDocument()
    expect(within(list).getByTestId('task-t4')).toBeInTheDocument()
    expect(within(list).queryByTestId('task-t5')).not.toBeInTheDocument()
  })

  it('shows done state on detail tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('task-t3')).toHaveAttribute('data-done', 'false')
  })

  it('toggling a task updates the detail percent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('50')
    // mark t3 done -> 3 of 4 -> 75
    await user.click(screen.getByTestId('toggle-t3'))
    expect(screen.getByTestId('task-t3')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('75')
  })

  it('toggling a done task back undoes it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    await user.click(screen.getByTestId('toggle-t1'))
    expect(screen.getByTestId('task-t1')).toHaveAttribute('data-done', 'false')
    // 1 of 4 done -> 25
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('25')
  })
})
