import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('quizzes list', () => {
  it('lists the seeded quizzes with question counts', () => {
    render(<App />)
    const list = screen.getByTestId('quiz-list')
    expect(within(list).getByTestId('quiz-q1-title')).toHaveTextContent('Geography Basics')
    expect(within(list).getByTestId('quiz-q1-count')).toHaveTextContent('3')
    expect(within(list).getByTestId('quiz-q2-title')).toHaveTextContent('Math Basics')
    expect(within(list).getByTestId('quiz-q2-count')).toHaveTextContent('1')
  })

  it('starting a quiz navigates to take with its title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('start-q1'))
    expect(screen.getByTestId('page-take')).toBeInTheDocument()
    expect(screen.getByTestId('take-title')).toHaveTextContent('Geography Basics')
  })

  it('shows a no-active message on take before starting a quiz', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-take'))
    expect(screen.getByTestId('no-active')).toBeInTheDocument()
  })
})
