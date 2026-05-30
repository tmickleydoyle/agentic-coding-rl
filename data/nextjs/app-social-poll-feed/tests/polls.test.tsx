import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('polls list', () => {
  it('lists the seeded polls', () => {
    render(<App />)
    const list = screen.getByTestId('poll-list')
    expect(within(list).getByText('Best language?')).toBeInTheDocument()
    expect(within(list).getByText('Tabs or spaces?')).toBeInTheDocument()
    expect(within(list).getByText('Coffee or tea?')).toBeInTheDocument()
  })

  it('shows total votes per poll', () => {
    render(<App />)
    expect(screen.getByTestId('poll-q1-total')).toHaveTextContent('15') // 5+3+7
    expect(screen.getByTestId('poll-q2-total')).toHaveTextContent('8') // 2+6
    expect(screen.getByTestId('poll-q3-total')).toHaveTextContent('8') // 4+4
  })

  it('shows the voted indicator based on seed state', () => {
    render(<App />)
    expect(screen.getByTestId('poll-q1-voted')).toHaveTextContent('Not voted')
    expect(screen.getByTestId('poll-q2-voted')).toHaveTextContent('Voted')
  })

  it('opens a poll detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    expect(screen.getByTestId('page-poll')).toBeInTheDocument()
    expect(screen.getByTestId('detail-question')).toHaveTextContent('Best language?')
  })
})
