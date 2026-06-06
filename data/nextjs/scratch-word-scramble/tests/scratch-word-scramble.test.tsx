import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Word Scramble', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows initial score 0 / 5', () => {
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0 / 5')
  })

  it('shows first scrambled word', () => {
    expect(screen.getByTestId('scrambled')).toHaveTextContent('acter')
  })

  it('shows progress Word 1 of 5', () => {
    expect(screen.getByTestId('progress')).toHaveTextContent('Word 1 of 5')
  })

  it('shows empty feedback initially', () => {
    expect(screen.getByTestId('feedback')).toHaveTextContent('')
  })

  it('shows Correct! and increments score on correct answer', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'react')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Correct!')
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 1 / 5')
  })

  it('shows Wrong! feedback on incorrect answer', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'wrong')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Wrong! The word was: react')
  })

  it('does not increment score on wrong answer', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'wrong')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0 / 5')
  })

  it('advances to next word after submit', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'react')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('scrambled')).toHaveTextContent('crsyptitep')
    expect(screen.getByTestId('progress')).toHaveTextContent('Word 2 of 5')
  })

  it('clears input after submit', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'react')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByLabelText('Your answer')).toHaveValue('')
  })

  it('shows Skipped! feedback on skip', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /skip/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Skipped! The word was: react')
  })

  it('does not increment score on skip', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /skip/i }))
    expect(screen.getByTestId('score')).toHaveTextContent('Score: 0 / 5')
  })

  it('does not advance on empty submit', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('progress')).toHaveTextContent('Word 1 of 5')
  })

  it('matches case-insensitively', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Your answer'), 'REACT')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByTestId('feedback')).toHaveTextContent('Correct!')
  })

  it('shows game over after all words', async () => {
    const user = userEvent.setup()
    const words = ['react', 'typescript', 'component', 'function', 'variable']
    for (const w of words) {
      await user.type(screen.getByLabelText('Your answer'), w)
      await user.click(screen.getByRole('button', { name: /submit/i }))
    }
    expect(screen.getByTestId('result')).toHaveTextContent('Game Over! You scored 5 out of 5.')
  })

  it('hides input/submit/skip after game over', async () => {
    const user = userEvent.setup()
    const words = ['react', 'typescript', 'component', 'function', 'variable']
    for (const w of words) {
      await user.type(screen.getByLabelText('Your answer'), w)
      await user.click(screen.getByRole('button', { name: /submit/i }))
    }
    expect(screen.queryByLabelText('Your answer')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
  })
})
