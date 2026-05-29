import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WordCount from '../components/WordCount'

describe('WordCount', () => {
  it('starts at 0', () => {
    render(<WordCount />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('counts words', async () => {
    const user = userEvent.setup()
    render(<WordCount />)
    await user.type(screen.getByTestId('text'), 'hello world')
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('collapses multiple spaces (does not over-count)', async () => {
    const user = userEvent.setup()
    render(<WordCount />)
    await user.type(screen.getByTestId('text'), 'a  b   c')
    expect(screen.getByTestId('count')).toHaveTextContent('3')
  })

  it('treats whitespace-only as 0', async () => {
    const user = userEvent.setup()
    render(<WordCount />)
    await user.type(screen.getByTestId('text'), '   ')
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
