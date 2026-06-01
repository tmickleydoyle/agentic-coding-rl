import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('trending page', () => {
  it('orders polls by total votes descending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trending'))
    const items = within(screen.getByTestId('trend-list')).getAllByRole('listitem')
    // totals: q1=15, q2=8, q3=8 => q1 first
    expect(items[0]).toHaveAttribute('data-testid', 'trend-q1')
  })

  it('shows trend stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trending'))
    expect(screen.getByTestId('stat-polls')).toHaveTextContent('3')
    // 15 + 8 + 8 = 31
    expect(screen.getByTestId('stat-votes')).toHaveTextContent('31')
  })

  it('updates trend stats after a vote', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('vote-q1-o1'))
    await user.click(screen.getByTestId('nav-trending'))
    expect(screen.getByTestId('stat-votes')).toHaveTextContent('32')
    expect(screen.getByTestId('trend-q1-total')).toHaveTextContent('16')
  })

  it('a newly created poll appears in trending stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('question-input'), 'Fresh poll')
    await user.type(screen.getByTestId('option-input-0'), 'A')
    await user.type(screen.getByTestId('option-input-1'), 'B')
    await user.click(screen.getByTestId('submit-poll'))
    await user.click(screen.getByTestId('nav-trending'))
    expect(screen.getByTestId('stat-polls')).toHaveTextContent('4')
  })
})
