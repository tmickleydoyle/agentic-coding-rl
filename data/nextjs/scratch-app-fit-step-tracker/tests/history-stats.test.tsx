import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('history and stats', () => {
  it('lists seeded entries most-recent-first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const rows = screen.getByTestId('entry-list').querySelectorAll('li')
    expect(rows[0].getAttribute('data-testid')).toBe('entry-s3') // 05-27 newest
    expect(rows[2].getAttribute('data-testid')).toBe('entry-s1') // 05-25 oldest
  })

  it('flags whether each entry met the goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('entry-s1')).toHaveAttribute('data-met', 'true') // 12000
    expect(screen.getByTestId('entry-s2')).toHaveAttribute('data-met', 'false') // 8000
  })

  it('removes an entry from history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-s2'))
    expect(screen.queryByTestId('entry-s2')).not.toBeInTheDocument()
  })

  it('computes streak, total, average and days met from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('31000')
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('10333')
    expect(screen.getByTestId('stat-met-value')).toHaveTextContent('2')
  })

  it('lowering the goal increases the streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goals'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '5000')
    await user.click(screen.getByTestId('submit-goal'))
    await user.click(screen.getByTestId('nav-stats'))
    // all three seed days >= 5000 now => streak 3
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-met-value')).toHaveTextContent('3')
  })

  it('updates the goal on the goals page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('10000')
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '12000')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('current-goal')).toHaveTextContent('12000')
  })

  it('rejects a non-positive goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goals'))
    await user.clear(screen.getByTestId('goal-input'))
    await user.type(screen.getByTestId('goal-input'), '0')
    await user.click(screen.getByTestId('submit-goal'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('current-goal')).toHaveTextContent('10000')
  })

  it('reflects a logged today entry in the streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    // log 05-28 at 15000 (>= goal); now 05-28 met, 05-27 met, 05-26 missed => streak 2
    await user.type(screen.getByTestId('steps-input'), '15000')
    await user.click(screen.getByTestId('submit-steps'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('2')
  })

  it('shows an empty state when all entries are removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-s1'))
    await user.click(screen.getByTestId('remove-s2'))
    await user.click(screen.getByTestId('remove-s3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('entry-list')).not.toBeInTheDocument()
  })
})
