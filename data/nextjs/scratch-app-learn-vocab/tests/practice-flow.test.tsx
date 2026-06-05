import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function practiceL1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('practice-l1'))
}

describe('practice flow', () => {
  it('shows correct feedback for a right answer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await practiceL1(user)
    await user.type(screen.getByTestId('answer-input'), 'perro')
    await user.click(screen.getByTestId('check-answer'))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Correct')
    expect(screen.getByTestId('feedback')).toHaveAttribute('data-correct', 'true')
  })

  it('is case-insensitive and trims whitespace', async () => {
    const user = userEvent.setup()
    render(<App />)
    await practiceL1(user)
    await user.type(screen.getByTestId('answer-input'), '  PERRO ')
    await user.click(screen.getByTestId('check-answer'))
    expect(screen.getByTestId('feedback')).toHaveAttribute('data-correct', 'true')
  })

  it('shows wrong feedback and reveals the answer for a wrong guess', async () => {
    const user = userEvent.setup()
    render(<App />)
    await practiceL1(user)
    await user.type(screen.getByTestId('answer-input'), 'wrong')
    await user.click(screen.getByTestId('check-answer'))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Wrong')
    expect(screen.getByTestId('feedback')).toHaveAttribute('data-correct', 'false')
    expect(screen.getByTestId('correct-answer')).toHaveTextContent('perro')
  })

  it('next-word advances to the next prompt and clears feedback', async () => {
    const user = userEvent.setup()
    render(<App />)
    await practiceL1(user)
    await user.type(screen.getByTestId('answer-input'), 'perro')
    await user.click(screen.getByTestId('check-answer'))
    await user.click(screen.getByTestId('next-word'))
    expect(screen.getByTestId('prompt-term')).toHaveTextContent('cat')
    expect(screen.queryByTestId('feedback')).not.toBeInTheDocument()
    expect(screen.getByTestId('answer-input')).toHaveValue('')
  })

  it('next-word wraps back to the first word at the end of the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('practice-l2')) // single-word list
    expect(screen.getByTestId('prompt-term')).toHaveTextContent('yes')
    await user.click(screen.getByTestId('next-word'))
    expect(screen.getByTestId('prompt-term')).toHaveTextContent('yes')
  })

  it('a correct answer raises mastery (reflected on the lists page)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await practiceL1(user)
    // l1-w2 (cat) starts at mastery 1; answer it twice correctly -> reaches 3 (mastered)
    await user.click(screen.getByTestId('next-word')) // move to cat
    await user.type(screen.getByTestId('answer-input'), 'gato')
    await user.click(screen.getByTestId('check-answer'))
    await user.click(screen.getByTestId('next-word')) // wraps to house
    await user.click(screen.getByTestId('next-word')) // back to dog
    await user.click(screen.getByTestId('next-word')) // to cat again
    await user.type(screen.getByTestId('answer-input'), 'gato')
    await user.click(screen.getByTestId('check-answer'))
    await user.click(screen.getByTestId('nav-lists'))
    // dog still 0, cat now 3 (mastered), house 3 -> 2 mastered
    expect(screen.getByTestId('list-l1-mastered')).toHaveTextContent('2')
  })

  it('a wrong answer resets mastery to zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('practice-l2')) // French: oui mastery 2
    await user.type(screen.getByTestId('answer-input'), 'non')
    await user.click(screen.getByTestId('check-answer'))
    await user.click(screen.getByTestId('nav-progress'))
    // l2 had 0 mastered before; still 0 after reset, percent 0
    expect(screen.getByTestId('prog-list-l2-percent')).toHaveTextContent('0')
  })
})
