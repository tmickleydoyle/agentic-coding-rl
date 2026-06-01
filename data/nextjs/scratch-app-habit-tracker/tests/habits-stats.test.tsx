import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('habits and stats', () => {
  it('lists each habit with its name and current streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('manage-h1-name')).toHaveTextContent('Drink water')
    expect(screen.getByTestId('manage-h1-streak')).toHaveTextContent('3')
    expect(screen.getByTestId('manage-h2-streak')).toHaveTextContent('2')
    // h3 last done 05-26, not today nor yesterday -> streak 0
    expect(screen.getByTestId('manage-h3-streak')).toHaveTextContent('0')
  })

  it('deletes a habit from the manage list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    await user.click(screen.getByTestId('delete-h2'))
    expect(screen.queryByTestId('manage-h2')).not.toBeInTheDocument()
  })

  it('shows an empty state when all habits are deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    await user.click(screen.getByTestId('delete-h1'))
    await user.click(screen.getByTestId('delete-h2'))
    await user.click(screen.getByTestId('delete-h3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('habit-manage-list')).not.toBeInTheDocument()
  })

  it('computes seed stats: done, total, rate, longest streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-done-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-rate-value')).toHaveTextContent('67')
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('3')
  })

  it('deleting a habit updates the totals and rate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    await user.click(screen.getByTestId('delete-h3'))
    await user.click(screen.getByTestId('nav-stats'))
    // remaining h1, h2 both done today => 2/2 = 100
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-rate-value')).toHaveTextContent('100')
  })

  it('shows empty state on the today page with no habits', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    await user.click(screen.getByTestId('delete-h1'))
    await user.click(screen.getByTestId('delete-h2'))
    await user.click(screen.getByTestId('delete-h3'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByTestId('today-percent')).toHaveTextContent('0')
  })
})
