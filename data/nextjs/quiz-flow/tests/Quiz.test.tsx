import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Quiz from '../components/Quiz'

const QS = [
  { prompt: 'Q1?', choices: ['a', 'b', 'c'], answer: 1 },
  { prompt: 'Q2?', choices: ['x', 'y'],      answer: 0 },
  { prompt: 'Q3?', choices: ['p', 'q', 'r'], answer: 2 },
]

describe('Quiz', () => {
  it('shows first question + progress', () => {
    render(<Quiz questions={QS} />)
    expect(screen.getByTestId('prompt')).toHaveTextContent('Q1?')
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 1/3')
    expect(screen.getByTestId('choice-0')).toHaveTextContent('a')
    expect(screen.getByTestId('choice-1')).toHaveTextContent('b')
  })

  it('clicking a choice advances to the next question', async () => {
    const user = userEvent.setup()
    render(<Quiz questions={QS} />)
    await user.click(screen.getByTestId('choice-1'))
    expect(screen.getByTestId('prompt')).toHaveTextContent('Q2?')
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 2/3')
  })

  it('all correct → result 3/3 and only result + restart remain', async () => {
    const user = userEvent.setup()
    render(<Quiz questions={QS} />)
    await user.click(screen.getByTestId('choice-1'))
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-2'))
    expect(screen.getByTestId('result')).toHaveTextContent('3/3')
    expect(screen.queryByTestId('prompt')).toBeNull()
    expect(screen.queryByTestId('progress')).toBeNull()
    expect(screen.getByTestId('restart')).toBeInTheDocument()
  })

  it('partial correct → result reflects only the right ones', async () => {
    const user = userEvent.setup()
    render(<Quiz questions={QS} />)
    // 0 (wrong on Q1: answer=1), 1 (wrong on Q2: answer=0), 2 (correct on Q3)
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-1'))
    await user.click(screen.getByTestId('choice-2'))
    expect(screen.getByTestId('result')).toHaveTextContent('1/3')
  })

  it('Restart resets to question 1 with no result', async () => {
    const user = userEvent.setup()
    render(<Quiz questions={QS} />)
    await user.click(screen.getByTestId('choice-1'))
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-2'))
    await user.click(screen.getByTestId('restart'))
    expect(screen.queryByTestId('result')).toBeNull()
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 1/3')
  })
})
