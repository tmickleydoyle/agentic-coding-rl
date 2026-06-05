import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('review page', () => {
  it('shows no-review before submitting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('start-q1'))
    await user.click(screen.getByTestId('nav-review'))
    expect(screen.getByTestId('no-review')).toBeInTheDocument()
  })

  it('marks each question correct/incorrect with chosen + correct text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('start-q1'))
    await user.click(screen.getByTestId('choice-q1a-c1')) // correct (Paris)
    await user.click(screen.getByTestId('choice-q1b-c1')) // wrong (Atlantic, answer Pacific)
    // q1c left unanswered
    await user.click(screen.getByTestId('submit-quiz'))
    await user.click(screen.getByTestId('review-button'))

    expect(screen.getByTestId('review-q1a')).toHaveAttribute('data-correct', 'true')
    expect(screen.getByTestId('review-q1a-chosen')).toHaveTextContent('Paris')
    expect(screen.getByTestId('review-q1a-correct')).toHaveTextContent('Paris')

    expect(screen.getByTestId('review-q1b')).toHaveAttribute('data-correct', 'false')
    expect(screen.getByTestId('review-q1b-chosen')).toHaveTextContent('Atlantic')
    expect(screen.getByTestId('review-q1b-correct')).toHaveTextContent('Pacific')

    expect(screen.getByTestId('review-q1c')).toHaveAttribute('data-correct', 'false')
    expect(screen.getByTestId('review-q1c-chosen')).toHaveTextContent('—')
    expect(screen.getByTestId('review-q1c-correct')).toHaveTextContent('Africa')
  })

  it('navigates from results to review via the review button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('start-q2'))
    await user.click(screen.getByTestId('choice-q2a-c2'))
    await user.click(screen.getByTestId('submit-quiz'))
    await user.click(screen.getByTestId('review-button'))
    expect(screen.getByTestId('page-review')).toBeInTheDocument()
    expect(screen.getByTestId('review-q2a')).toHaveAttribute('data-correct', 'true')
  })
})
