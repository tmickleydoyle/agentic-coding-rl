import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('words page', () => {
  it('lists all words with lengths and marks the current one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-words'))
    expect(screen.getByTestId('word-list').querySelectorAll('li').length).toBe(4)
    expect(screen.getByTestId('word-0-len')).toHaveTextContent('3') // cat
    expect(screen.getByTestId('word-3-len')).toHaveTextContent('6') // banana
    expect(screen.getByTestId('word-0-current')).toHaveTextContent('current')
    expect(screen.getByTestId('word-1-current')).toHaveTextContent('')
  })

  it('picking a word jumps to it on the play page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-words'))
    await user.click(screen.getByTestId('pick-2')) // puzzle (6 letters)
    await user.click(screen.getByTestId('nav-play'))
    expect(screen.getByTestId('masked')).toHaveTextContent('______')
    await user.click(screen.getByTestId('key-p'))
    expect(screen.getByTestId('masked')).toHaveTextContent('p_____')
  })

  it('marks the newly picked word as current', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-words'))
    await user.click(screen.getByTestId('pick-1'))
    expect(screen.getByTestId('word-1-current')).toHaveTextContent('current')
    expect(screen.getByTestId('word-0-current')).toHaveTextContent('')
  })
})
