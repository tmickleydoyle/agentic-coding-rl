import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function startQ1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('start-q1'))
}

describe('take + scoring flow', () => {
  it('renders one question block per question with choices', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    expect(screen.getByTestId('question-q1a')).toBeInTheDocument()
    expect(screen.getByTestId('question-q1a-prompt')).toHaveTextContent('Capital of France?')
    expect(screen.getByTestId('choice-q1a-c1')).toBeInTheDocument()
    expect(screen.getByTestId('choice-q1a-c2')).toBeInTheDocument()
  })

  it('marks a selected choice with aria-pressed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c1'))
    expect(screen.getByTestId('choice-q1a-c1')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('choice-q1a-c2')).not.toHaveAttribute('aria-pressed')
  })

  it('changing a choice moves the aria-pressed marker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c1'))
    await user.click(screen.getByTestId('choice-q1a-c2'))
    expect(screen.getByTestId('choice-q1a-c1')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByTestId('choice-q1a-c2')).toHaveAttribute('aria-pressed', 'true')
  })

  it('scores a fully-correct attempt as passed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c1'))
    await user.click(screen.getByTestId('choice-q1b-c2'))
    await user.click(screen.getByTestId('choice-q1c-c3'))
    await user.click(screen.getByTestId('submit-quiz'))
    expect(screen.getByTestId('page-results')).toBeInTheDocument()
    expect(screen.getByTestId('score-value')).toHaveTextContent('3')
    expect(screen.getByTestId('total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('pass-fail')).toHaveTextContent('Passed')
    expect(screen.getByTestId('pass-fail')).toHaveAttribute('data-passed', 'true')
  })

  it('scores a mostly-wrong attempt as failed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c2')) // wrong
    await user.click(screen.getByTestId('choice-q1b-c1')) // wrong
    await user.click(screen.getByTestId('choice-q1c-c3')) // correct
    await user.click(screen.getByTestId('submit-quiz'))
    expect(screen.getByTestId('score-value')).toHaveTextContent('1')
    expect(screen.getByTestId('pass-fail')).toHaveTextContent('Failed')
    expect(screen.getByTestId('pass-fail')).toHaveAttribute('data-passed', 'false')
  })

  it('shows no-results before submitting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('nav-results'))
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
  })

  it('does not change answers after submitting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c1'))
    await user.click(screen.getByTestId('submit-quiz'))
    // go back to take, attempt to change a choice; submitted-lock ignores it
    await user.click(screen.getByTestId('nav-take'))
    await user.click(screen.getByTestId('choice-q1a-c2'))
    expect(screen.getByTestId('choice-q1a-c1')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('choice-q1a-c2')).not.toHaveAttribute('aria-pressed')
  })

  it('retake clears answers and returns to take', async () => {
    const user = userEvent.setup()
    render(<App />)
    await startQ1(user)
    await user.click(screen.getByTestId('choice-q1a-c1'))
    await user.click(screen.getByTestId('submit-quiz'))
    await user.click(screen.getByTestId('retake-button'))
    expect(screen.getByTestId('page-take')).toBeInTheDocument()
    expect(screen.getByTestId('choice-q1a-c1')).not.toHaveAttribute('aria-pressed')
  })
})
