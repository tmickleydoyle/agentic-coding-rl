import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Trivia Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows first question on mount', () => {
    render(<App />)
    expect(screen.getByTestId('question-text')).toHaveTextContent('What is the capital of France?')
  })

  it('shows question number 1 of 5', () => {
    render(<App />)
    expect(screen.getByTestId('question-number')).toHaveTextContent('Question 1 of 5')
  })

  it('shows 4 option buttons', () => {
    render(<App />)
    expect(screen.getAllByTestId('option')).toHaveLength(4)
  })

  it('shows timer starting at 15', () => {
    render(<App />)
    expect(screen.getByTestId('timer')).toHaveTextContent('Time: 15')
  })

  it('shows score 0 initially', () => {
    render(<App />)
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0')
  })

  it('timer counts down', () => {
    render(<App />)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByTestId('timer')).toHaveTextContent('Time: 12')
  })

  it('shows Correct! and increments score on correct answer', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Correct!')
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 1')
  })

  it('shows Incorrect! on wrong answer', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Berlin' }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Incorrect! Answer: Paris')
  })

  it('advances to next question after correct answer + delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('question-number')).toHaveTextContent('Question 2 of 5')
  })

  it('resets timer to 15 on new question', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    render(<App />)
    act(() => { vi.advanceTimersByTime(5000) })
    await user.click(screen.getByRole('button', { name: 'Paris' }))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('timer')).toHaveTextContent('Time: 15')
  })

  it('shows Incorrect on timeout and advances', () => {
    render(<App />)
    act(() => { vi.advanceTimersByTime(15000) })
    expect(screen.getByTestId('feedback')).toHaveTextContent('Incorrect! Answer: Paris')
  })

  it('shows final score after all questions', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    render(<App />)
    const answers = ['Paris', 'Mercury', '56', 'Shakespeare', 'H2O']
    for (const ans of answers) {
      await user.click(screen.getByRole('button', { name: ans }))
      act(() => { vi.advanceTimersByTime(1000) })
    }
    expect(screen.getByTestId('final-score')).toHaveTextContent('Final Score: 5 / 5')
  })
})
