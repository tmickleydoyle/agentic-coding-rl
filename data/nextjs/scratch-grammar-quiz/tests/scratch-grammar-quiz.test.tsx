import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Grammar Quiz', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Grammar Quiz' })).toBeTruthy()
  })

  it('shows question 1 of 5 initially', () => {
    expect(screen.getByTestId('question-number').textContent).toBe('Question 1 of 5')
  })

  it('shows score 0 initially', () => {
    expect(screen.getByTestId('score').textContent).toBe('Score: 0')
  })

  it('shows first question text', () => {
    expect(screen.getByTestId('question-text').textContent).toBe('Which is correct?')
  })

  it('renders 4 option buttons', () => {
    expect(screen.getByTestId('option-0')).toBeTruthy()
    expect(screen.getByTestId('option-1')).toBeTruthy()
    expect(screen.getByTestId('option-2')).toBeTruthy()
    expect(screen.getByTestId('option-3')).toBeTruthy()
  })

  it('no feedback shown initially', () => {
    expect(screen.queryByTestId('feedback')).toBeNull()
  })

  it('no next-btn shown initially', () => {
    expect(screen.queryByTestId('next-btn')).toBeNull()
  })

  it('correct answer shows Correct! and increments score', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('option-1'))
    expect(screen.getByTestId('feedback').textContent).toBe('Correct!')
    expect(screen.getByTestId('score').textContent).toBe('Score: 1')
  })

  it('wrong answer shows Incorrect feedback', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('option-0'))
    expect(screen.getByTestId('feedback').textContent).toContain('Incorrect. The answer is:')
    expect(screen.getByTestId('score').textContent).toBe('Score: 0')
  })

  it('options disabled after answering', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('option-2'))
    const btn = screen.getByTestId('option-0') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('next-btn appears after answering', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('option-1'))
    expect(screen.getByTestId('next-btn')).toBeTruthy()
  })

  it('advances to question 2 after clicking Next', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('option-1'))
    await user.click(screen.getByTestId('next-btn'))
    expect(screen.getByTestId('question-number').textContent).toBe('Question 2 of 5')
  })

  it('last question shows Finish button', async () => {
    const user = userEvent.setup()
    for (let q = 0; q < 4; q++) {
      await user.click(screen.getByTestId('option-0'))
      await user.click(screen.getByTestId('next-btn'))
    }
    await user.click(screen.getByTestId('option-0'))
    expect(screen.getByTestId('next-btn').textContent).toBe('Finish')
  })

  it('shows final score after finishing', async () => {
    const user = userEvent.setup()
    for (let q = 0; q < 4; q++) {
      await user.click(screen.getByTestId('option-0'))
      await user.click(screen.getByTestId('next-btn'))
    }
    await user.click(screen.getByTestId('option-0'))
    await user.click(screen.getByTestId('next-btn'))
    expect(screen.getByTestId('final-score').textContent).toContain('Final Score:')
    expect(screen.getByTestId('restart-btn')).toBeTruthy()
  })

  it('restart resets to question 1 with score 0', async () => {
    const user = userEvent.setup()
    for (let q = 0; q < 4; q++) {
      await user.click(screen.getByTestId('option-0'))
      await user.click(screen.getByTestId('next-btn'))
    }
    await user.click(screen.getByTestId('option-0'))
    await user.click(screen.getByTestId('next-btn'))
    await user.click(screen.getByTestId('restart-btn'))
    expect(screen.getByTestId('question-number').textContent).toBe('Question 1 of 5')
    expect(screen.getByTestId('score').textContent).toBe('Score: 0')
  })
})
