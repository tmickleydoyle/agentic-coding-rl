import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history', () => {
  it('shows the seeded history entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-list')).toBeInTheDocument()
    expect(screen.getByTestId('history-h1-title')).toHaveTextContent('Water plants')
    expect(screen.getByTestId('history-h1-date')).toHaveTextContent('2026-05-28')
    expect(screen.getByTestId('history-count')).toHaveTextContent('1')
  })

  it('grows the history when a weekly task is completed', async () => {
    const user = userEvent.setup()
    render(<App />)
    // make t3 (weekly, due 2026-06-02) due by... it is not due, so complete a due one:
    await user.click(screen.getByTestId('complete-t2'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-count')).toHaveTextContent('2')
    expect(screen.getByTestId('history-h2-title')).toHaveTextContent('Take meds')
  })

  it('keeps history after the task is removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('complete-t1')) // adds h2 for Water plants
    await user.click(screen.getByTestId('nav-all-tasks'))
    await user.click(screen.getByTestId('remove-t1'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-h2')).toBeInTheDocument()
    expect(screen.getByTestId('history-count')).toHaveTextContent('2')
  })
})
