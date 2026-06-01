import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('play + results flow', () => {
  it('starts a Geography quiz and shows the first prompt', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    expect(screen.getByTestId('page-play')).toBeInTheDocument()
    expect(screen.getByTestId('prompt')).toHaveTextContent('Capital of France?')
    expect(screen.getByTestId('progress')).toHaveTextContent('1 / 2')
    expect(screen.getByTestId('score')).toHaveTextContent('0')
  })

  it('scores a correct answer and advances', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    await user.click(screen.getByTestId('choice-0')) // Paris, correct
    expect(screen.getByTestId('score')).toHaveTextContent('10')
    expect(screen.getByTestId('progress')).toHaveTextContent('2 / 2')
    expect(screen.getByTestId('prompt')).toHaveTextContent('Largest ocean?')
  })

  it('finishing the quiz navigates to results with the final score', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    await user.click(screen.getByTestId('choice-0')) // q1 correct
    await user.click(screen.getByTestId('choice-1')) // q2 correct (Pacific)
    expect(screen.getByTestId('page-results')).toBeInTheDocument()
    expect(screen.getByTestId('final-score')).toHaveTextContent('20')
    expect(screen.getByTestId('max-score')).toHaveTextContent('20')
  })

  it('a wrong answer keeps the score lower', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    await user.click(screen.getByTestId('choice-1')) // q1 wrong
    await user.click(screen.getByTestId('choice-1')) // q2 correct
    expect(screen.getByTestId('final-score')).toHaveTextContent('10')
  })

  it('saving a score appends to the leaderboard and ranks it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-1')) // 20 points -> results
    await user.type(screen.getByTestId('name-input'), 'Zed')
    await user.click(screen.getByTestId('save-score'))
    expect(screen.getByTestId('page-leaderboard')).toBeInTheDocument()
    expect(screen.getByTestId('entry-count')).toHaveTextContent('3')
    expect(screen.getByTestId('entry-e3-name')).toHaveTextContent('Zed')
    expect(screen.getByTestId('entry-e3-score')).toHaveTextContent('20')
    // ranked: Ada 50 first
    const first = screen.getByTestId('entry-list').querySelector('li')
    expect(first).toHaveAttribute('data-testid', 'entry-e1')
  })

  it('play-again restarts the same category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Geography'))
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-1'))
    await user.click(screen.getByTestId('play-again'))
    expect(screen.getByTestId('page-play')).toBeInTheDocument()
    expect(screen.getByTestId('prompt')).toHaveTextContent('Capital of France?')
    expect(screen.getByTestId('score')).toHaveTextContent('0')
  })

  it('saving with a blank name shows an error and stays on results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('cat-Math'))
    await user.click(screen.getByTestId('choice-0'))
    await user.click(screen.getByTestId('choice-2'))
    await user.click(screen.getByTestId('save-score'))
    expect(screen.getByTestId('results-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-results')).toBeInTheDocument()
  })
})
