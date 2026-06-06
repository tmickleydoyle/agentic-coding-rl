import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WordCounter from '../components/WordCounter'

describe('WordCounter', () => {
  it('starts with word count 0', () => {
    render(<WordCounter />)
    expect(screen.getByTestId('word-count')).toHaveTextContent('0')
  })

  it('counts a single word', async () => {
    const user = userEvent.setup()
    render(<WordCounter />)
    await user.type(screen.getByTestId('textarea'), 'hello')
    expect(screen.getByTestId('word-count')).toHaveTextContent('1')
  })

  it('counts multiple words', async () => {
    const user = userEvent.setup()
    render(<WordCounter />)
    await user.type(screen.getByTestId('textarea'), 'hello world foo')
    expect(screen.getByTestId('word-count')).toHaveTextContent('3')
  })

  it('returns 0 for whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<WordCounter />)
    await user.type(screen.getByTestId('textarea'), '   ')
    expect(screen.getByTestId('word-count')).toHaveTextContent('0')
  })

  it('clears textarea and resets count', async () => {
    const user = userEvent.setup()
    render(<WordCounter />)
    await user.type(screen.getByTestId('textarea'), 'hello world')
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.getByTestId('word-count')).toHaveTextContent('0')
    expect(screen.getByTestId('textarea')).toHaveValue('')
  })

  it('handles multiple spaces between words', async () => {
    const user = userEvent.setup()
    render(<WordCounter />)
    await user.type(screen.getByTestId('textarea'), 'one   two')
    expect(screen.getByTestId('word-count')).toHaveTextContent('2')
  })
})
