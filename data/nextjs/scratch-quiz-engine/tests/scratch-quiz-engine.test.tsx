import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function escRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

describe('Quiz Engine', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows the heading', () => {
    expect(screen.getByRole('heading', { name: /quiz engine/i })).toBeInTheDocument()
  })

  it('shows question 1 of 5 progress', () => {
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 1 of 5')
  })

  it('shows the first question text', () => {
    expect(screen.getByTestId('question')).toHaveTextContent('What is 2 + 2?')
  })

  it('shows four answer buttons for the first question', () => {
    expect(screen.getByRole('button', { name: /A\) 3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /B\) 4/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /C\) 5/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /D\) 6/i })).toBeInTheDocument()
  })

  it('shows "Correct!" when the right answer is selected', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /B\) 4/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Correct!')
  })

  it('shows wrong feedback with correct answer when wrong option is selected', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /A\) 3/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Wrong! The answer was 4')
  })

  it('disables answer buttons after selection', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /A\) 3/i }))
    const buttons = screen.getAllByRole('button', { name: /[A-D]\)/ })
    buttons.forEach(btn => expect(btn).toBeDisabled())
  })

  it('shows Next button after answering (not last question)', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /B\) 4/i }))
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('advances to next question when Next is clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /B\) 4/i }))
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 2 of 5')
    expect(screen.getByTestId('question')).toHaveTextContent('capital of France')
  })

  it('clears feedback when advancing to next question', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /B\) 4/i }))
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.queryByTestId('feedback')).not.toBeInTheDocument()
  })

  it('shows Finish instead of Next on the last question', async () => {
    const user = userEvent.setup()
    // answer all 5 questions
    const answers = ['B) 4', 'C) Paris', 'D) Mercury', 'B) Purple', 'C) 6']
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getByRole('button', { name: new RegExp(escRe(answers[i]), 'i') })
      await user.click(btn)
      if (i < answers.length - 1) {
        await user.click(screen.getByRole('button', { name: /next/i }))
      }
    }
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
  })

  it('shows results screen with correct score after finishing', async () => {
    const user = userEvent.setup()
    const answers = ['B) 4', 'C) Paris', 'D) Mercury', 'B) Purple', 'C) 6']
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getByRole('button', { name: new RegExp(escRe(answers[i]), 'i') })
      await user.click(btn)
      if (i < answers.length - 1) {
        await user.click(screen.getByRole('button', { name: /next/i }))
      }
    }
    await user.click(screen.getByRole('button', { name: /finish/i }))
    expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument()
    expect(screen.getByTestId('score')).toHaveTextContent('You scored 5 / 5')
  })

  it('shows partial score when some answers are wrong', async () => {
    const user = userEvent.setup()
    // answer all wrong for Q1, then correct for rest
    const answers = ['A) 3', 'C) Paris', 'D) Mercury', 'B) Purple', 'C) 6']
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getByRole('button', { name: new RegExp(escRe(answers[i]), 'i') })
      await user.click(btn)
      if (i < answers.length - 1) {
        await user.click(screen.getByRole('button', { name: /next/i }))
      }
    }
    await user.click(screen.getByRole('button', { name: /finish/i }))
    expect(screen.getByTestId('score')).toHaveTextContent('You scored 4 / 5')
  })

  it('restarts the quiz from the results screen', async () => {
    const user = userEvent.setup()
    const answers = ['B) 4', 'C) Paris', 'D) Mercury', 'B) Purple', 'C) 6']
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getByRole('button', { name: new RegExp(escRe(answers[i]), 'i') })
      await user.click(btn)
      if (i < answers.length - 1) {
        await user.click(screen.getByRole('button', { name: /next/i }))
      }
    }
    await user.click(screen.getByRole('button', { name: /finish/i }))
    await user.click(screen.getByRole('button', { name: /restart/i }))
    expect(screen.getByTestId('progress')).toHaveTextContent('Question 1 of 5')
    expect(screen.getByTestId('question')).toHaveTextContent('What is 2 + 2?')
  })
})
