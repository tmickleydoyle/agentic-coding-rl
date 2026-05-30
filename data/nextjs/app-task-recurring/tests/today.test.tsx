import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today / due list', () => {
  it('lists tasks due today (nextDue <= today)', () => {
    render(<App />)
    // t1 due today, t2 overdue => both due; t3 due 2026-06-02 => not due
    expect(screen.getByTestId('due-t1')).toBeInTheDocument()
    expect(screen.getByTestId('due-t2')).toBeInTheDocument()
    expect(screen.queryByTestId('due-t3')).not.toBeInTheDocument()
  })

  it('shows the due count', () => {
    render(<App />)
    expect(screen.getByTestId('due-count')).toHaveTextContent('2')
  })

  it('completing a daily task advances its next due by one day and removes it from today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('complete-t1'))
    // t1 daily, today 2026-05-29 -> next due 2026-05-30, no longer due today
    expect(screen.queryByTestId('due-t1')).not.toBeInTheDocument()
    expect(screen.getByTestId('due-count')).toHaveTextContent('1')
  })

  it('shows an empty state once all due tasks are completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('complete-t1'))
    await user.click(screen.getByTestId('complete-t2'))
    expect(screen.getByTestId('empty-today')).toBeInTheDocument()
    expect(screen.queryByTestId('due-list')).not.toBeInTheDocument()
  })

  it('completing a task records a history entry with today as the date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('complete-t1'))
    await user.click(screen.getByTestId('nav-history'))
    // seed history h1 + new h2
    expect(screen.getByTestId('history-h2')).toBeInTheDocument()
    expect(screen.getByTestId('history-h2-date')).toHaveTextContent('2026-05-29')
  })
})
